# Datwo

Datwoime format and compare

## Table of Content

- [Installation](#installation)
- [Usage](#usage)
  - [Format](#format)
  - [Compare](#compare)
- [API](#api)
  - [geoip](#geoip)
  - [asn](#asn)

## Installation

```
npm i datwo
```

## Usage

datwo can override vanilla Date class

### Format

ESM

```js
import Date from 'datwo';

console.log(new Date().format('YYYY-MM-DD hh:mm:ss'));
console.log(new Date().format('YY-M-D N h:m:s.CC'));
console.log(new Date().format('YYYY / DDD / sssss / CCC'));
```

CJS

```js
const Date = require('datwo').default;

console.log(new Date().format('YYYY-MM-DD hh:mm:ss'));
console.log(new Date().format('YY-M-D N h:m:s.CC'));
console.log(new Date().format('YYYY / DDD / sssss / CCC'));
```

<details><summary>Result</summary>

```
2022-09-25 14:30:00
22-9-25 PM 2:30:0.02
2022 / 267 / 52200 / 023
```

</details>

Format Characters

| Chars   | Meaning                         | Example       |
| ------- | ------------------------------- | ------------- |
| `YYYY`  | 4 digit Year                    | 2022          |
| `YY`    | 2 digit Year                    | 22            |
| `MM`    | 2 digit Month (0#)              | 09            |
| `M`     | 1-2 digit Month                 | 9             |
| `DDD`   | 3 digit Day (00#) (in year)     | 237           |
| `DD`    | 2 digit Day (0#)                | 07            |
| `D`     | 1-2 digit Day                   | 7             |
| `hh`    | 2 digit Hour (0#)               | 08            |
| `h`     | 1-2 digit Hour                  | 8             |
| `hhhh`  | 2 digit Hour (0#) (in 12 hours) | 08            |
| `hhh`   | 1-2 digit Hour (in 12 hours)    | 8             |
| `mm`    | 2 digit Minute (0#)             | 03            |
| `m`     | 1-2 digit Minute                | 3             |
| `sssss` | 5 digit Second (in day)         | 04363         |
| `ss`    | 2 digit Second (0#)             | 09            |
| `s`     | 1-2 digit Second                | 9             |
| `CCC`   | 3 digit Milisecond (00#)        | 123           |
| `CC`    | 2 digit Milisecond (0#)         | 12            |
| `C`     | 1 digit Milisecond              | 1             |
| `T`     | new Date().getTime()            | 1664076951031 |
|         |                                 |               |
| `N`     | AM / PM                         | AM            |
| `NK`    | 오전 / 오후                     | 오전          |
| `G`     | Time words of day               | Morning       |
| `GK`    | 시간대를 나타내는 단어          | 아침          |

### Compare

```js
console.log(new Date('2022-01-02 00:00:00').compare(new Date('2021-12-29 00:05:00')));
console.log(new Date('2022-01-02 00:00:00').compare(new Date('2022-01-01 00:10:00')));
console.log(new Date('2022-01-02 00:00:00').compare(new Date('2022-01-01 24:53:00')));
console.log(new Date('2022-01-02 00:00:00.000').compare(new Date('2022-01-01 24:59:59.256')));
```

<details><summary>Result</summary>

```
사흘 전
23시간 전
7분 전
744밀리초 전
```

</details>
