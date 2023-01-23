"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Datwo = exports.Date = void 0;

class Datwo extends Date {
  format(format) {
    const T = this.getTime();
    const YYYY = this.getFullYear().toString();
    const YY = YYYY.substring(2);
    const M = this.getMonth() + 1;
    const MM = (M < 10 ? '0' : '') + M;
    const D = this.getDate();
    const DD = (D < 10 ? '0' : '') + D;
    const startday = new Date(YYYY + '-01-01');
    const diff = T - startday.getTime() + (startday.getTimezoneOffset() - this.getTimezoneOffset()) * 60 * 1000;
    const oneDay = 1000 * 60 * 60 * 24;
    let DDDa = Math.floor(diff / oneDay);
    DDDa = (DDDa < 10 ? '0' : '') + DDDa;
    DDDa = (DDDa < 100 ? '0' : '') + DDDa;
    const DDD = DDDa;
    const h = this.getHours();
    const hh = (h < 10 ? '0' : '') + h;
    const hm = h % 12;
    const hhm = (hm < 10 ? '0' : '') + hm;
    const m = this.getMinutes();
    const mm = (m < 10 ? '0' : '') + m;
    const mmmm = h * 60 + m;
    const s = this.getSeconds();
    const ss = (s < 10 ? '0' : '') + s;
    const sssss = mmmm * 60 + s;
    let CCC = this.getMilliseconds();

    if (CCC < 10) {
      CCC = '00' + CCC;
    } else if (CCC < 100) {
      CCC = '0' + CCC;
    }

    const CC = CCC.toString().slice(0, -1);
    const C = CC.toString().slice(0, -1);
    let DH = '';

    if (1 <= hh * 1 && hh * 1 <= 3) {
      DH = 'Night';
    } else if (1 <= hh * 4 && hh * 1 <= 5) {
      DH = 'Daybreak';
    } else if (6 <= hh * 1 && hh * 1 <= 8) {
      DH = 'Morning';
    } else if (9 <= hh * 1 && hh * 1 <= 12) {
      DH = 'Daytime';
    } else if (13 <= hh * 1 && hh * 1 <= 17) {
      DH = 'Afternoon';
    } else if (18 <= hh * 1 && hh * 1 <= 21) {
      DH = 'Evening';
    } else if (22 <= hh * 1 && hh * 1 <= 24 || hh * 1 == 0) {
      DH = 'Night';
    }

    let DHK = '';

    if (1 <= hh * 1 && hh * 1 <= 5) {
      DHK = '새벽';
    } else if (6 <= hh * 1 && hh * 1 <= 8) {
      DHK = '아침';
    } else if (9 <= hh * 1 && hh * 1 <= 12) {
      DHK = '낮';
    } else if (13 <= hh * 1 && hh * 1 <= 17) {
      DHK = '오후';
    } else if (18 <= hh * 1 && hh * 1 <= 21) {
      DHK = '저녁';
    } else if (22 <= hh * 1 && hh * 1 <= 24 || hh * 1 == 0) {
      DHK = '밤';
    }

    const APM = h < 13 ? 'AM' : 'PM';
    const APMK = h < 13 ? '오전' : '오후';
    format = format + '';
    format = format.replace(/YYYY/g, YYYY);
    format = format.replace(/YY/g, YY);
    format = format.replace(/MM/g, MM);
    format = format.replace(/M/g, M);
    format = format.replace(/DDD/g, DDD);
    format = format.replace(/DD/g, DD);
    format = format.replace(/D/g, D);
    format = format.replace(/hhhh/g, hhm);
    format = format.replace(/hhh/g, hm);
    format = format.replace(/hh/g, hh);
    format = format.replace(/h/g, h);
    format = format.replace(/mmmm/g, mmmm);
    format = format.replace(/mm/g, mm);
    format = format.replace(/m/g, m);
    format = format.replace(/sssss/g, sssss);
    format = format.replace(/ss/g, ss);
    format = format.replace(/s/g, s);
    format = format.replace(/CCC/g, CCC);
    format = format.replace(/CC/g, CC);
    format = format.replace(/C/g, C);
    format = format.replace(/T/g, T);
    format = format.replace(/GK/g, DHK);
    format = format.replace(/G/g, DH);
    format = format.replace(/NK/g, APMK);
    format = format.replace(/N/g, APM);
    return format;
  }

  compare(target, options = {}) {
    if (!target || !target.getTime) {
      target = new Date(target);
    }

    const C = this.getTime();
    const T = target.getTime();
    const P = C - T;

    if (!options.lang) {
      options.lang = 'ko_kr';
    }

    if (!options.detail) {
      options.detail = 'm';
    }

    if (!options.number) {
      options.number = false;
    }

    switch (options.lang) {
      case 'ko_kr':
        {
          return ko_kr();
          break;
        }

      case 'en_us':
        {
          return en_us();
          break;
        }

      default:
        {
          return ko_kr();
          break;
        }
    }

    function ko_kr() {
      if (P == 0) {
        return '지금';
      } else if (P > 0) {
        if (P >= 1000 * 60 * 60 * 24 * 365) {
          const Y = Math.floor(P / (1000 * 60 * 60 * 24 * 365));

          if (options.number) {
            return Y + '년 전';
          } else {
            switch (Y) {
              case 1:
                {
                  return '작년';
                }

              case 2:
                {
                  return '재작년';
                }

              default:
                {
                  return Y + '년 전';
                }
            }
          }
        } else if (P >= 1000 * 60 * 60 * 24 * 30) {
          if (options.detail == 'Y') {
            return '방금 전';
          }

          const M = Math.floor(P / (1000 * 60 * 60 * 24 * 30));

          if (options.number) {
            return M + '개월 전';
          } else {
            switch (M) {
              case 1:
                {
                  return '한 달 전';
                }

              case 2:
                {
                  return '두 달 전';
                }

              case 3:
                {
                  return '세 달 전';
                }

              case 4:
                {
                  return '네 달 전';
                }

              case 5:
                {
                  return '다섯 달 전';
                }

              case 6:
                {
                  return '여섯 달 전';
                }

              case 7:
                {
                  return '일곱 달 전';
                }

              case 8:
                {
                  return '여덟 달 전';
                }

              case 9:
                {
                  return '아홉 달 전';
                }

              case 10:
                {
                  return '열 달 전';
                }

              case 11:
                {
                  return '열한 달 전';
                }

              case 12:
                {
                  return '열두 달 전';
                }

              default:
                {
                  return M + '개월 전';
                }
            }
          }
        } else if (P >= 1000 * 60 * 60 * 24) {
          if (options.detail == 'M') {
            return '방금 전';
          }

          const D = Math.floor(P / (1000 * 60 * 60 * 24));

          if (options.number) {
            return D + '일 전';
          } else {
            switch (D) {
              case 1:
                {
                  return '어제';
                }

              case 2:
                {
                  return '그저께';
                }

              case 3:
                {
                  return '사흘 전';
                }

              case 4:
                {
                  return '나흘 전';
                }

              case 5:
                {
                  return '닷세 전';
                }

              case 6:
                {
                  return '엿세 전';
                }

              case 7:
                {
                  return '이레 전';
                }

              case 8:
                {
                  return '여드레 전';
                }

              case 9:
                {
                  return '아흐레 전';
                }

              case 10:
                {
                  return '열흘 전';
                }

              case 15:
                {
                  return '보름 전';
                }

              default:
                {
                  return D + '일 전';
                }
            }
          }
        } else if (P >= 1000 * 60 * 60) {
          if (options.detail == 'D') {
            return '방금 전';
          }

          const h = Math.floor(P / (1000 * 60 * 60));
          return h + '시간 전';
        } else if (P >= 1000 * 60) {
          if (options.detail == 'h') {
            return '방금 전';
          }

          const m = Math.floor(P / (1000 * 60));
          return m + '분 전';
        } else if (P >= 1000) {
          if (options.detail == 'm') {
            return '방금 전';
          }

          const s = Math.floor(P / 1000);
          return s + '초 전';
        } else {
          if (options.detail == 's') {
            return '방금 전';
          }

          const c = P;
          return c + '밀리초 전';
        }
      } else if (P < 0) {
        if (P >= 1000 * 60 * 60 * 24 * 365) {
          const Y = Math.floor(P / (1000 * 60 * 60 * 24 * 365));

          if (options.number) {
            return Y + '년 후';
          } else {
            switch (Y) {
              case 1:
                {
                  return '내년';
                }

              case 2:
                {
                  return '내후년';
                }

              default:
                {
                  return Y + '년 후';
                }
            }
          }
        } else if (P >= 1000 * 60 * 60 * 24 * 30) {
          if (options.detail == 'Y') {
            return '조금 뒤';
          }

          const M = Math.floor(P / (1000 * 60 * 60 * 24 * 30));

          if (options.number) {
            return M + '개월 후';
          } else {
            switch (M) {
              case 1:
                {
                  return '한 달 후';
                }

              case 2:
                {
                  return '두 달 후';
                }

              case 3:
                {
                  return '세 달 후';
                }

              case 4:
                {
                  return '네 달 후';
                }

              case 5:
                {
                  return '다섯 달 후';
                }

              case 6:
                {
                  return '여섯 달 후';
                }

              case 7:
                {
                  return '일곱 달 후';
                }

              case 8:
                {
                  return '여덟 달 후';
                }

              case 9:
                {
                  return '아홉 달 후';
                }

              case 10:
                {
                  return '열 달 후';
                }

              case 11:
                {
                  return '열한 달 후';
                }

              case 12:
                {
                  return '열두 달 후';
                }

              default:
                {
                  return M + '개월 후';
                }
            }
          }
        } else if (P >= 1000 * 60 * 60 * 24) {
          if (options.detail == 'M') {
            return '조금 뒤';
          }

          const D = Math.floor(P / (1000 * 60 * 60 * 24));

          if (options.number) {
            return D + '일 후';
          } else {
            switch (D) {
              case 1:
                {
                  return '내일';
                }

              case 2:
                {
                  return '모래';
                }

              case 3:
                {
                  return '사흘 뒤';
                }

              case 4:
                {
                  return '나흘 뒤';
                }

              case 5:
                {
                  return '닷세 뒤';
                }

              case 6:
                {
                  return '엿세 뒤';
                }

              case 7:
                {
                  return '이레 뒤';
                }

              case 8:
                {
                  return '여드레 뒤';
                }

              case 9:
                {
                  return '아흐레 뒤';
                }

              case 10:
                {
                  return '열흘 뒤';
                }

              case 15:
                {
                  return '보름 뒤';
                }

              default:
                {
                  return D + '일 후';
                }
            }
          }
        } else if (P >= 1000 * 60 * 60) {
          if (options.detail == 'D') {
            return '조금 뒤';
          }

          const h = Math.floor(P / (1000 * 60 * 60));
          return h + '시간 후';
        } else if (P >= 1000 * 60) {
          if (options.detail == 'h') {
            return '조금 뒤';
          }

          const m = Math.floor(P / (1000 * 60));
          return m + '분 후';
        } else if (P >= 1000) {
          if (options.detail == 'm') {
            return '조금 뒤';
          }

          const s = Math.floor(P / 1000);
          return s + '초 후';
        } else {
          if (options.detail == 's') {
            return '조금 뒤';
          }

          const c = P;
          return c + '밀리초 후';
        }
      } else {
        return '?';
      }
    }

    function en_us() {
      if (p == 0) {
        return 'now';
      } else if (P > 0) {
        if (P >= 1000 * 60 * 60 * 24 * 365) {
          const Y = Math.floor(P / (1000 * 60 * 60 * 24 * 365));

          if (Y == 1) {
            return Y + ' year ago';
          } else {
            return Y + ' years ago';
          }
        } else if (P >= 1000 * 60 * 60 * 24 * 30) {
          if (options.detail == 'Y') {
            return 'just before';
          }

          const M = Math.floor(P / (1000 * 60 * 60 * 24 * 30));

          if (M == 1) {
            return M + ' month ago';
          } else {
            return M + ' months ago';
          }
        } else if (P >= 1000 * 60 * 60 * 24) {
          if (options.detail == 'M') {
            return 'just before';
          }

          const D = Math.floor(P / (1000 * 60 * 60 * 24));

          if (D == 1) {
            return D + ' day ago';
          } else {
            return D + ' days ago';
          }
        } else if (P >= 1000 * 60 * 60) {
          if (options.detail == 'D') {
            return 'just before';
          }

          const h = Math.floor(P / (1000 * 60 * 60));

          if (h == 1) {
            return h + ' hour ago';
          } else {
            return h + ' hours ago';
          }
        } else if (P >= 1000 * 60) {
          if (options.detail == 'h') {
            return 'just before';
          }

          const m = Math.floor(P / (1000 * 60));

          if (m == 1) {
            return m + ' minute ago';
          } else {
            return m + ' minutes ago';
          }
        } else if (P >= 1000) {
          if (options.detail == 'm') {
            return 'just before';
          }

          const s = Math.floor(P / 1000);

          if (s == 1) {
            return s + ' second ago';
          } else {
            return s + ' seconds ago';
          }
        } else {
          if (options.detail == 's') {
            return 'just before';
          }

          const c = p;

          if (c == 1) {
            return c + ' millisecond ago';
          } else {
            return c + ' milliseconds ago';
          }
        }
      } else if (P < 0) {
        return 'future';
      } else {
        return '?';
      }
    }
  }

  stamp(type) {
    switch (type) {
      case 'log':
        {
          return '\x1b[0m\x1b[36m' + new Date().format('YYYY-MM-DD hh:mm:ss') + '\x1b[0m';
        }

      case 'logm':
        {
          return '[' + new Date().format('YYYY-MM-DD hh:mm:ss.CCC') + ']: ';
        }

      case 'db':
        {
          return new Date().format('YYYY-MM-DD;hh-mm-ss');
        }

      default:
        {
          return '[' + new Date().format('YYYY-MM-DD hh:mm:ss') + ']: ';
        }
    }
  }

}

exports.Date = exports.Datwo = Datwo;
var _default = Datwo;
exports.default = _default;

