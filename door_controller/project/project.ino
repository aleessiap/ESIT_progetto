#include <IRrecv.h>
#include <LiquidCrystal_I2C.h>
#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include <MQTT.h>
#include <ArduinoJson.h>
#include <time.h>

#define emptyString String()

#include "errors.h"
#include "configuration.h"

const uint8_t SCLpin = D1;
const uint8_t SDApin = D2;
const uint8_t recPin = D3;

const uint8_t max_passwd_length = 50;
uint8_t current_char = 0;

IRrecv irrecv(recPin);
decode_results results;

const uint8_t lcdColumns = 16;
const uint8_t lcdRows = 2;

const int MQTT_PORT = 8883;ò

const char MQTT_SUB_TOPIC[] = "$aws/things/" THINGNAME "/shadow/update/delta";
const char MQTT_PUB_TOPIC[] = "$aws/things/" THINGNAME "/shadow/update";

#ifdef USE_SUMMER_TIME_DST
uint8_t DST = 1;
#else
uint8_t DST = 0;
#endif

WiFiClientSecure net;

BearSSL::X509List cert(cacert);
BearSSL::X509List client_crt(client_cert);
BearSSL::PrivateKey key(privKey);

MQTTClient client(1024);

time_t now;
time_t sent;
time_t nowish = 1510592825;

bool wait_for_app = false;

unsigned long previousMillis = 0;
const long interval = 11;

LiquidCrystal_I2C lcd(0x27, lcdColumns, lcdRows);

void resetPassword(char * const passwd);
bool checkPassword(char * const passwd);

void deleteLastDigit(char * const passwd);

void scan_i2c_address(void);

void NTPConnect(void);

void connectToMqtt(bool nonBlocking = false);
void verifyWiFiAndMQTT(void);

// [ AWS UPDATES ] --------------------------------------

#define MAX_Q_LENGTH 256

typedef enum {

  LOCK = 0,
  DENY = 1,
  ALLOW = 2,
  WAIT_PIN = 3

} door_state;

typedef struct {

  time_t stp;
  door_state d_state;

} shadow_update_t;

const shadow_update_t NULL_UPDATE = {};

typedef struct {

  door_state d_state;
  char last_password[max_passwd_length];

} shadow_state_t;

shadow_state_t state = {};
shadow_update_t updates[MAX_Q_LENGTH] = {};
size_t q_head = MAX_Q_LENGTH - 1;
size_t q_tail = 0;

bool is_empty();
bool is_full();
bool push_update(shadow_update_t upd);
shadow_update_t pop_update();

void receive_update(String &topic, String &payload);
void send_update(void);
void send_password(void);
void handle_update(shadow_update_t upd);

bool is_empty() {

    return (q_head + 1) % MAX_Q_LENGTH == q_tail;

  }


bool is_full() {

    return q_head == q_tail;

  }

bool push_update(shadow_update_t upd) {

    if(!is_full()) {

      updates[q_tail] = upd;
      q_tail = (q_tail + 1) % MAX_Q_LENGTH;

      return true;

    } else {

      return false;

    }

  }

shadow_update_t pop_update() {

    if(!is_empty()) {

      q_head = (q_head + 1) % MAX_Q_LENGTH;
      return updates[q_head];

     } else {

      return NULL_UPDATE;

     }

  }

void receive_update(String &topic, String &payload) {

   shadow_update_t aux;
   char json[1024] = "";
   payload.toCharArray(json, 1024);
   DynamicJsonDocument doc(JSON_OBJECT_SIZE(3) + 1024);
   deserializeJson(doc, json);

   Serial.println("[MQTT] Received [" + topic + "]: " + payload);

   aux.stp = doc["timestamp"];
   aux.d_state = doc["state"]["d_state"];

   if(!push_update(aux)) {

      Serial.println("[LOG] Cannot add update to queue! Queue is full.");

   }

}

void send_update(void) {

   DynamicJsonDocument jsonBuffer(JSON_OBJECT_SIZE(3) + 1024);
   JsonObject root = jsonBuffer.to<JsonObject>();
   JsonObject st = root.createNestedObject("state");
   JsonObject st_reported = st.createNestedObject("reported");

   st_reported["d_state"] = state.d_state;

   Serial.printf("[MQTT] Sending [%s]:", MQTT_PUB_TOPIC);
   serializeJson(root, Serial);
   Serial.println();

   char shadow[measureJson(root) + 1];
   serializeJson(root, shadow, sizeof(shadow));

   if(!client.publish(MQTT_PUB_TOPIC, shadow, false, 0)) {

      lwMQTTErr(client.lastError());

   }

}

void send_password(void) {

   DynamicJsonDocument jsonBuffer(JSON_OBJECT_SIZE(3) + 100);
   JsonObject root = jsonBuffer.to<JsonObject>();
   JsonObject st = root.createNestedObject("state");
   JsonObject st_reported = st.createNestedObject("reported");

   st_reported["last_password"] = state.last_password;

   Serial.printf("[MQTT] Sending [%s]:", MQTT_PUB_TOPIC);
   serializeJson(root, Serial);
   Serial.println();

   char shadow[measureJson(root) + 1];
   serializeJson(root, shadow, sizeof(shadow));

   if(!client.publish(MQTT_PUB_TOPIC, shadow, false, 0)) {

      lwMQTTErr(client.lastError());

   }

}

void handle_update(shadow_update_t upd) {

      state.d_state = upd.d_state;

  }

// ------------------------------------------------------

void setup() {

   Serial.begin(115200);

   while (!Serial) {

      delay(10);
      Serial.println();

   }

   Serial.println();
   Serial.println();
   Serial.println();

   irrecv.enableIRIn();


   lcd.init();
   lcd.backlight();
   lcd.begin(16,2);

   lcd.clear();
   lcd.setCursor(0, 0);
   lcd.print("Iniz...");

   WiFi.hostname(THINGNAME);
   WiFi.mode(WIFI_STA);
   WiFi.begin(ssid, WiFipassword);
   connectToWiFi(String("[LOG] Trying to connect with SSID:") + String(ssid));
   NTPConnect();

   net.setTrustAnchors(&cert);
   net.setClientRSACert(&client_crt, &key);

   client.begin(MQTT_HOST, MQTT_PORT, net);
   client.onMessage(receive_update);

   connectToMqtt();
   state.d_state = WAIT_PIN;
   send_update();

}

void loop() {

   now = time(nullptr);
   bool updates = !is_empty();

   while(!is_empty()) {

     handle_update(pop_update());

   }

   if(updates) {

     wait_for_app = false;
     send_update();

   }

   if(state.d_state == WAIT_PIN && wait_for_app) {

     lcd.setCursor(0, 1);
     lcd.printf("Verifica... %d", (now - sent));

     if((now - sent) > interval) {

       wait_for_app = false;
       lcd.clear();
       lcd.setCursor(0, 0);
       lcd.print("Pin:");

     }


   } else {

   switch(state.d_state) {

      case LOCK:

        if(updates) {

          lcd.clear();
          lcd.setCursor(0, 0);
          lcd.print("Porta bloccata!");

        }
        break;

      case DENY:

        if(updates){

          lcd.setCursor(0, 1);
          lcd.print("Acc. fallito!");

        }

        break;

      case ALLOW:

        if(updates) {

          lcd.setCursor(0, 1);
          lcd.print("Acc. riuscito!");

        }

        break;

      case WAIT_PIN:

        if(updates) {

           lcd.clear();
           lcd.setCursor(0, 0);
           lcd.print("Pin:");

        }

        if(irrecv.decode(&results)) {

           switch(results.value) {

              case 0xFFC23D:

                wait_for_app = true;
                sent = now;
                send_password();
                resetPassword(state.last_password);

                break;

              case 0xFFE01F:

                // Serial.println("-");
                deleteLastDigit(state.last_password);

                lcd.clear();
                lcd.setCursor(0, 0);
                lcd.print("Pin:");

                for (uint8_t i = 0; i < current_char; i++) {

                  lcd.print("*");

                }

                break;

              case 0xFF6897:

                // Serial.println("0");
                state.last_password[current_char] = '0';
                lcd.print("*");
                current_char++;
                break;

              case 0xFF30CF:

                // Serial.println("1");
                state.last_password[current_char] = '1';
                lcd.print("*");
                current_char++;
                break;

              case 0xFF18E7:

                // Serial.println("2");
                state.last_password[current_char] = '2';
                lcd.print("*");
                current_char++;
                break;

              case 0xFF7A85:

                // Serial.println("3");
                state.last_password[current_char] = '3';
                lcd.print("*");
                current_char++;
                break;

              case 0xFF10EF:

                // Serial.println("4");
                state.last_password[current_char] = '4';
                lcd.print("*");
                current_char++;
                break;

              case 0xFF38C7:

                // Serial.println("5");
                state.last_password[current_char] = '5';
                lcd.print("*");
                current_char++;
                break;

              case 0xFF5AA5:

                // Serial.println("6");
                state.last_password[current_char] = '6';
                lcd.print("*");
                current_char++;
                break;

              case 0xFF42BD:

                // Serial.println("7");
                state.last_password[current_char] = '7';
                lcd.print("*");
                current_char++;
                break;

              case 0xFF4AB5:

                // Serial.println("8");
                state.last_password[current_char] = '8';
                lcd.print("*");
                current_char++;
                break;

              case 0xFF52AD:

                 // Serial.println("9");
                state.last_password[current_char] = '9';
                lcd.print("*");
                current_char++;
                break;

              default:
                ;

            }

            irrecv.resume();

        }
        break;

   }
   }

   if(!client.connected()){

      verifyWiFiAndMQTT();

   }

   client.loop();
   delay(15);

}

void resetPassword(char * const passwd) {

   for (uint8_t i = 0 ; i < max_passwd_length; i++) {

      passwd[i] = '\0';

   }

   current_char = 0;

}

void deleteLastDigit(char * const passwd) {

   if(current_char != 0) {

      passwd[current_char - 1] = '\0';
      current_char--;

   }

}

void scan_i2c_address(void) {

   byte error, address;
   int nDevices = 0;
   Serial.println("[LOG] Scanning I2C addresses...");

   for(address = 1; address < 127; address++ ) {

      Wire.beginTransmission(address);
      error = Wire.endTransmission();

      if (error == 0) {

         Serial.print("I2C device found at address 0x");

         if (address<16) {

            Serial.print("0");
         }

         Serial.println(address,HEX);
         nDevices++;

      } else if (error==4) {

         Serial.print("Unknow error at address 0x");

         if (address<16) {

            Serial.print("0");
         }

         Serial.println(address,HEX);

      }

   }

   if (nDevices == 0) {

      Serial.println("No I2C devices found\n");

   } else {

      Serial.println("done\n");

   }

}

void NTPConnect(void) {

  Serial.print("[LOG] Setting time using SNTP");
  configTime(TIME_ZONE * 3600, DST * 3600, "pool.ntp.org", "time.nist.gov");
  now = time(nullptr);

  while(now < nowish) {

    delay(500);
    Serial.print(".");
    now = time(nullptr);

  }

  Serial.println(" done!");
  struct tm timeinfo;
  gmtime_r(&now, &timeinfo);
  Serial.print("[LOG] Current time: ");
  Serial.print(asctime(&timeinfo));

}

void connectToMqtt(bool nonBlocking) {

   Serial.print("[LOG] MQTT connecting: ");
   lcd.clear();
   lcd.setCursor(0, 0);
   lcd.print("Connecting...");

   while (!client.connected()){

      if(client.connect(THINGNAME)) {

         Serial.println("connected!");

         if(!client.subscribe(MQTT_SUB_TOPIC)) {

            Serial.println("[ERROR] Client not subscribed");
            lwMQTTErr(client.lastError());

         }

      } else {

         Serial.print("[ERROR] SSL Error Code: ");
         Serial.println(net.getLastSSLError());
         Serial.print("failed, reason -> ");
         lwMQTTErrConnection(client.returnCode());

         if(!nonBlocking) {

            Serial.println("< try again in 5 seconds"),
            delay(5000);

         } else {

            Serial.print(" <");

         }

      }

      if (nonBlocking){

         break;

      }

   }

   lcd.clear();
   lcd.setCursor(0, 0);
   lcd.print("Pin:");

}

void connectToWiFi(String init_str) {

   if(init_str != emptyString) {

      Serial.print(init_str);

   }

   while(WiFi.status() != WL_CONNECTED) {

      Serial.print(".");
      delay(1000);

   }

   if(init_str != emptyString) {

      Serial.println(" ok");

   }

}

void verifyWiFiAndMQTT(void) {

   connectToWiFi("[LOG] Checking WiFi:");
   connectToMqtt();

}
