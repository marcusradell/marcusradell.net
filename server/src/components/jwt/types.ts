export type JwtSignFailed = {
  cid: string;
  type: "jwt#sign>failed";
  data: string[];
};

export type JwtSignSucceeded = {
  cid: string;
  type: "jwt#sign>succeeded";
  data: string;
};

export type JwtSignResult = JwtSignFailed | JwtSignSucceeded;
