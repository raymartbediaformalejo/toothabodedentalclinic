const j = require("jsonwebtoken");

class Tokens {
  static dT(t) {
    if (!t) return {};
    const u = j.decode(t);
    return u;
  }

  static gT(u) {
    try {
      const aT = j.sign({ ...u }, process.env.ACCESS_KEY, { expiresIn: "1m" });
      const rT = j.sign({ ...u }, process.env.REFRESH_KEY, {
        expiresIn: "15m",
      });
      return { aT, rT };
    } catch (error) {
      return {};
    }
  }

  static vAt(t) {
    try {
      j.verify(t, process.env.ACCESS_KEY);
      return t;
    } catch (error) {
      return undefined;
    }
  }

  static vRt(t) {
    try {
      j.verify(t, process.env.REFRESH_KEY);
      return t;
    } catch (error) {
      return undefined;
    }
  }

  static _rT(t) {
    const u = Tokens.dT(t);
    const nU = {
      i: u?.i,
      e: u?.e,
    };
    try {
      Tokens.vRt(t);
      const ts = Tokens.gT(nU);
      return ts;
    } catch (error) {
      return undefined;
    }
  }
}

module.exports = Tokens;
