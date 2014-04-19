#include <math.h>

void setup() {
  Serial.begin(9600);
}

double Thermister(int RawADC) {
  double Temp;
  Temp = log(((10240000/RawADC) - 10000));
  Temp = 1 / (0.001129148 + (0.000234125 * Temp) + (0.0000000876741 * Temp * Temp * Temp));
  Temp = Temp - 273.15;
  return Temp;
}

void loop() {
  int light = map(analogRead(0), 0, 1023, 0, 100);
  delay(1);
  
  double temp = Thermister(analogRead(1));
  delay(1);
  char sTemp[6] = { '\0' };
  dtostrf(temp, 5, 2, sTemp);
  
  char sOut[10] = { '\0' };
  sprintf(sOut, "%d,%s", light, deblank(sTemp));

  Serial.println(sOut);
  
  delay(1000);
}

char* deblank(char* input) {
  char *output=input;
  int i = 0;
  int j = 0;
  for (; i<strlen(input); i++,j++) {
      if (input[i] != ' ') {                                                  
          output[j]=input[i];
      } else {
          j--;
      }
  }
  output[j]='\0';
  return output;
}
