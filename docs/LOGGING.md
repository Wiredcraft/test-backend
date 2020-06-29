<h1 align="center">Wiredcraft Backend Test Document</h1>
<div align="center">
  <strong>Backend Development Evaluation Test</strong>
</div>
<br />

## Table of Content
* [Tooling](#tooling)
* [Strategy](#strategy)

## Tooling
Tests are written with the use of Winston logger. This can be achieved in a number of ways in NestJS.

1. The first is the general node way, exporting a logger function and calling it when needed. The drawback to this is, it cannot be used as a drop in replacement for Nest internal logging. This will cause you to lose some log messages if an internal system error occurs such as if nest loses connection with an external service like MongoDB.
2. Using winston as a Nest Module, tying into the nest application runtime by using the Nest logger interface allows you to completely replace the generic nest logger with the custom nest logger. This is the approach taken.

## Strategy
1. General rule of thumb is to log everything
2. Log format chosen is JSON
3. Log destinations are set to `*.log` files with three primary locations, `exceptions`, `debug` and `log` files each containing a different error level for easy navigation and investigation.
4. An additional destination is configured for deployment environments where the standard log channel is the standard output. Console logging is used in this case.

