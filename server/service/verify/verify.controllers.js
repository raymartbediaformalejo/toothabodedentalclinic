const Cookies = require("./../../utils/cookies");
const Tokens = require("./../../utils/tokens");

const verify = async (rq, rs) => {
  try {
    const cookies = Cookies.gC({ rq: rq.cookies });
    if (!cookies?.aT && !cookies?.rT) throw new Error("Unauthorized");

    const at = Tokens.vAt(cookies?.aT);
    const rt = Tokens.vRt(cookies?.rT);

    if (!at && !rt) throw new Error("Unauthorized");

    if (!at) {
      if (rt) {
        const ts = Tokens._rT(rt);
        Cookies.sC({
          rs: rs,
          ts: {
            aT: ts?.aT || "",
            rT: ts?.rT || "",
          },
        });
        return rs.status(200).send({ ok: true });
      } else {
        throw new Error("Unauthorized");
      }
    }

    return rs.status(200).send({ ok: true });
  } catch (error) {
    console.log("Error Verifying Token", error);
    return rs.status(400).send({ ok: false });
  }
};

module.exports = verify;
