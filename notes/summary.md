## Teoría

### Métricas de Performance

- Packet Loss
- Latencia: Retardo entre un estímulo y la respuesta
  > RTT: Round Trip Time , estimación de la latencia

### Tiempos de viaje

- Tiempo de inserción
  > T_ins = L / R
  > L = tamaño del paquete
  > R = velocidad de serialización
- Tiempo de propagación
  > T_prop = d / v
  > d = distancia
  > v = velocidad de propagación
- Tiempo de procesamiento
  > Tiempo de lectura del encabezado y decisión de la red
- Tiempo de encolado
  > Tiempo de espera hasta que el paquete sea transmitido
  > Depende de la tasa de ocupación del router, el tamaño de la cola, el tráfico

### Protocolo

Un protocolo define:

- Mensajes de petición y respuesta
- Sintaxis de los mensajes
- Campos - función, tamaño y delimitadores
- Procedimiento de envío de mensajes y sus respuestas

### Sockets

#### TCP

![tcp_socket](https://files.realpython.com/media/sockets-tcp-flow.1da426797e37.jpg)

##### Server

```
_socket = socket(socket.AF_INET, socket.SOCK_STREAM)
_socket.bind((host, port))
_socket.listen()

conn, addr = _socket.accept()

recv_data = conn.recv(1024)
conn.send(send_data)

conn.close()
_socket.close()
```

##### Client

```
_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
_socket.connect((host, port))

recv_data = _socket.recv(1024)
_socket.send(send_data)

_socket.close()
```

#### UDP

no hay `connect`

`send(data)` -> `sendto(data, address)`
`data = recv(buff)` -> `data, address = recvfrom(buff)`

### Capas

- Aplicación
- Transporte
- Red
- Enlace

#### Aplicación

Crear Apps que corran en diferentes hosts, comunicados través de la red

Implementada en los hosts

##### Protocolos

- HTTP ( HyperText Transfer Protocol )
- DNS (Domain Name System) ~

#### Transporte

Comunicar procesos corriendo en diferentes hosts

Implementada en los hosts

##### Servicio

- Mux/Demux (\*)
- Control de integridad (\*)
- Entrega confiable (RDT)
- Control de flujo
- Control de congestion

##### Protocolos

- TCP ( Transmission Control Protocol )
- UDP ( Unreliable Datagram Protocol )

#### Red

Comunicar hosts

##### Protocolos

- IP ( Internet Protocol )
- ICMP ( Internet Control Message Protocol )

#### Enlace

- ARP : Address Resolution Protocol ( MAC - IP )

## Ejercicios

- Tiempos de viaje (inserción y propagación)
- TCP (Reno/Tahoe)
- Tabla de routeo
- Fragmentación
- NAT
- Subneting

### Tiempos de viaje (inserción y propagación)

### TCP

pasar todo a MSS

> todo promedia para abajo excepto el packet size

cwin = congestion window
ssthresh = slow start threshold

iw = inital window
lw = loss window = 1MSS

#### Etapas

- Slow Start
  > cwin se duplica en cada ráfaga
- Congestion Avoidance
  > cwin aumenta en 1MSS en cada rafága
- Fast Retransmit
  > Se solo el paquete que se ha perdido
- Fast Recovery (Solo en Reno)
  > cwin se divide en 2

#### Transiciones

- cwin = ssthresh : ST -> CA
- 3ple ACK duplicado : \* -> FR + FR (Reno)
  > Tahoe: cwin = 1MSS
- Timeout : \* -> ST
  > cwin = 1MSS

> Perdida: ssthresh = cwin / 2

### Tabla de routeo

optimización y entradas invalidas
LPM: Longest Prefix Match

### Fragmentación

- MTU
- datagram = header + payload
- maxP = MTU - header
- max payload = floor(maxP/8) \* 8

### NAT

### Subneting
