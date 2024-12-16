class Cookies {
  static sC({ rs, ts }) {
    const isProduction = process.env.NODE_ENV === "production";
    if (rs && ts) {
      rs.cookie("tooth_abode_access_token", ts.aT, {
        maxAge: 60 * 1 * 100,
        httpOnly: true,
        sameSite: "none",
        secure: isProduction,
        path: "/",
      });
      rs.cookie("tooth_abode_refresh_token", ts.rT, {
        maxAge: 15 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax",
        path: "/",
      });
    }
    return true;
  }

  static gC({ rq }) {
    const aT = rq ? rq.tooth_abode_access_token : undefined;
    const rT = rq ? rq.tooth_abode_refresh_token : undefined;
    return { aT, rT };
  }
}

module.exports = Cookies;
