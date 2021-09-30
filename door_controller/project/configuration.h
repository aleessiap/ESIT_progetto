//This file contains the configuration variables required for the functioning of the project.ino file.

#include <pgmspace.h>

//ssid must contain the name of the wifi network to which the board will be connected.
const char ssid[] = ;

//WiFiPassword must contain the password of the wifi network to which the board will be connected.
const char WiFipassword[] = ;

//THINGNAME must contain the name of the AWS Thing related to the door to be controlled by the board.
#define THINGNAME ""

int8_t TIME_ZONE = +1;
#define USE_SUMMER_TIME_DST

//MQTT_HOST must contain the Amazon MQTT host name between ""
const char MQTT_HOST[] = "";

//cacert must contain the value of the Amazon CA1 certificate that was downloaded when the thing associated with the door was created. The value must be inserted between the strings 'BEGIN CERTIFICATE' and 'END CERTIFICATE'.
static const char cacert[] PROGMEM = R"EOF(
-----BEGIN CERTIFICATE-----

-----END CERTIFICATE-----
)EOF";

//client_cert must contain the value of the certificate that was downloaded when the thing associated with the door was created. The value must be inserted between the strings 'BEGIN CERTIFICATE' and 'END CERTIFICATE'.
static const char client_cert[] PROGMEM=R"KEY(
-----BEGIN CERTIFICATE-----

-----END CERTIFICATE-----
)KEY";


//privKey must contain the value of the private key that was downloaded when the thing associated with the door was created. The value must be inserted between the strings 'BEGIN RSA PRIVATE KEY' and 'END RSA PRIVATE KEY'.
static const char privKey[] PROGMEM = R"KEY(
-----BEGIN RSA PRIVATE KEY-----

-----END RSA PRIVATE KEY-----
)KEY";