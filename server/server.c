// headers
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#define PORT 3000

intToStr(int N, char * str){
    int i = 0;

    int sign = N;

    if (N < 0)
        N = -N;

        while (N > 0){
            str[i++] = N % 10 + '0';
            N /= 10;
        }

        if(sign < 0) {
            str[i++] = '-';
        }

        str[i] = '\0';

        for (int j = 0, k = i - 1; j < k; j++, k--) {
            char temp = str[j];
            str[j] = str[k];
            str[k] = temp;
        }
}

int main(int argc, char const* argv[]){
    int sockfd, incoming_socket;
    struct sockaddr_in address;
    char buffer[1024] = { 0 };
    char* hello = "hello from server";
    int opt = 1;

    if((sockfd = socket (AF_INET, SOCK_DGRAM, 0) < 0)){
        printf("error");
        exit(1);
    }

    int N = 1234;
    char str[12];

    intToStr(sockfd, str);
    printf("String: %s\n", str);

    address.sin_family = AF_INET;
    address.sin_addr.s_addr = INADDR_ANY;
    address.sin_port = htons(PORT);

    // bind to address

    if(bind(sockfd, (struct sockaddr*)&address, sizeof(address)) < 0) {
        printf("bind failed\n");
        exit(1);
    }

    if(listen(sockfd, 3) < 0){
        printf("listen\n");
        exit(1);
    }

    if((incoming_socket) = accept(sockfd, &address, sizeof(address))){
        printf("accepting socket failure");
        exit(1);
    }

    // listen on socket

    int valread = read(incoming_socket, buffer, 1024 - 1);

    // create response
    
    send(incoming_socket, hello, strlen(hello), 0);

    printf("hello message sent\n");

    return 0;
}