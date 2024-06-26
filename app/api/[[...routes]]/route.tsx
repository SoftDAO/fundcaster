/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
import { neynar } from "frog/hubs";
import { handle } from "frog/next";
import { createClient } from "@supabase/supabase-js";
import { serveStatic } from "frog/serve-static";
import axios from "axios";
import { ABI } from "../../../constants/abi";
import BigNumber from "bignumber.js";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

type State = {
  name: string;
  ticker: string;
  imageURL: string;
  description: string;
  initialSupply: number;
};

const app = new Frog<{ State: State }>({
  initialState: {
    name: "custom token",
    ticker: "CUSTOM",
    imageURL: "https://soft-pump-assets.s3.amazonaws.com/token.png",
    description: "no description provided",
    initialSupply: parseInt(process.env.DEFAULT_INITIAL_SUPPLY || "1000"),
  },
  // hub: neynar({ apiKey: process.env.NEYNAR_API_KEY || "" }),
  assetsPath: "/",
  basePath: "/api",
});

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame("/home", (c) => {
  return c.res({
    image: (
      <div
        style={{
          display: "flex",
          height: "100vh",
          width: "100vw",
          alignItems: "flex-start",
          paddingLeft: "60px",
          justifyContent: "center",
          flexDirection: "column",
          backgroundImage: "linear-gradient(to right, #014bad, #17101F)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: "80px",
            margin: "0px",
            color: "white",
          }}
        >
          welcome to fundcaster
        </h1>
        <p style={{ textAlign: "center", color: "white", fontSize: "30px" }}>
          token creation simplified
        </p>
        <div
          style={{
            position: "absolute",
            display: "flex",
            bottom: "0",
            right: "0",
            padding: "10px",
          }}
        >
          <img
            src="https://soft-pump-assets.s3.amazonaws.com/bg-blue_fg-white-removebg-preview.png"
            style={{ height: "50px" }}
            alt="SOFT logo"
          />
        </div>
      </div>
    ),
    intents: [
      <Button.Link href="https://www.thesoftdao.com/">Learn More</Button.Link>,
      <Button action="/name">Begin</Button>,
    ],
    title: "Fundcaster by SOFT",
  });
});

app.frame("/name", (c) => {
  // state won't save on the first frame
  return c.res({
    image: (
      <div
        style={{
          display: "flex",
          height: "100vh",
          width: "100vw",
          alignItems: "flex-start",
          paddingLeft: "60px",
          justifyContent: "center",
          flexDirection: "column",
          backgroundImage: "linear-gradient(to right, #014bad, #17101F)",
        }}
      >
        <div
          style={{
            position: "absolute",
            display: "flex",
            top: "0",
            left: "0",
            padding: "10px",
            color: "white",
            fontSize: "20px",
          }}
        >
          1/6
        </div>
        <h1
          style={{
            textAlign: "center",
            fontSize: "80px",
            margin: "0px",
            color: "white",
          }}
        >
          name your token
        </h1>
        <p style={{ textAlign: "center", color: "white", fontSize: "30px" }}>
          be creative—clever names often attract more attention
        </p>
        <div
          style={{
            position: "absolute",
            display: "flex",
            bottom: "0",
            right: "0",
            padding: "10px",
          }}
        >
          <img
            src="https://soft-pump-assets.s3.amazonaws.com/bg-blue_fg-white-removebg-preview.png"
            style={{ height: "50px" }}
            alt="SOFT logo"
          />
        </div>
      </div>
    ),
    intents: [
      <TextInput placeholder="(max. 16 characters)" />,
      <Button action="/home" value="back">
        Back
      </Button>,
      <Button action="/ticker" value="next">
        Next
      </Button>,
    ],
    title: "Fundcaster by SOFT",
  });
});

app.frame("/ticker", (c) => {
  const { buttonValue, inputText, deriveState } = c;
  const state = deriveState((previousState) => {
    // remove URL encoding from inputText
    if (buttonValue === "next" && inputText)
      previousState.name = decodeURIComponent(inputText);
  });

  return c.res({
    image: (
      <div
        style={{
          display: "flex",
          height: "100vh",
          width: "100vw",
          alignItems: "flex-start",
          paddingLeft: "60px",
          justifyContent: "center",
          flexDirection: "column",
          backgroundImage: "linear-gradient(to right, #014bad, #17101F)",
        }}
      >
        <div
          style={{
            position: "absolute",
            display: "flex",
            top: "0",
            left: "0",
            padding: "10px",
            color: "white",
            fontSize: "20px",
          }}
        >
          2/6
        </div>
        <h1
          style={{
            textAlign: "center",
            fontSize: "80px",
            margin: "0px",
            color: "white",
          }}
        >
          what's the ticker?
        </h1>
        <p style={{ textAlign: "center", color: "white", fontSize: "30px" }}>
          choose a unique ticker to stand out
        </p>
        <div
          style={{
            position: "absolute",
            display: "flex",
            bottom: "0",
            right: "0",
            padding: "10px",
          }}
        >
          <img
            src="https://soft-pump-assets.s3.amazonaws.com/bg-blue_fg-white-removebg-preview.png"
            style={{ height: "50px" }}
            alt="SOFT logo"
          />
        </div>
      </div>
    ),
    intents: [
      <TextInput placeholder="(max. 16 characters)" />,
      <Button action="/name" value="back">
        Back
      </Button>,
      <Button action="/image" value="next">
        Next
      </Button>,
    ],
    title: "Fundcaster by SOFT",
  });
});

app.frame("/image", (c) => {
  const { buttonValue, inputText, deriveState } = c;
  const state = deriveState((previousState) => {
    if (buttonValue === "next" && inputText) {
      // remove all special characters and spaces from inputText
      const regex = /[^a-zA-Z0-9]/g;
      const decodedText = decodeURIComponent(inputText);
      const cleanedText = inputText.replace(regex, "");
      if (cleanedText.length > 0)
        previousState.ticker = cleanedText.toUpperCase();
      else previousState.ticker = previousState.ticker;
    }
  });

  return c.res({
    image: (
      <div
        style={{
          display: "flex",
          height: "100vh",
          width: "100vw",
          alignItems: "flex-start",
          paddingLeft: "60px",
          justifyContent: "center",
          flexDirection: "column",
          backgroundImage: "linear-gradient(to right, #014bad, #17101F)",
        }}
      >
        <div
          style={{
            position: "absolute",
            display: "flex",
            top: "0",
            left: "0",
            padding: "10px",
            color: "white",
            fontSize: "20px",
          }}
        >
          3/6
        </div>
        <h1
          style={{
            textAlign: "center",
            fontSize: "80px",
            margin: "0px",
            color: "white",
          }}
        >
          pick a logo for {state.ticker}
        </h1>
        <p style={{ textAlign: "center", color: "white", fontSize: "30px" }}>
          enter or URL or click "Next" to use the default image
        </p>
        <div
          style={{
            position: "absolute",
            display: "flex",
            bottom: "0",
            right: "0",
            padding: "10px",
          }}
        >
          <img
            src="https://soft-pump-assets.s3.amazonaws.com/bg-blue_fg-white-removebg-preview.png"
            style={{ height: "50px" }}
            alt="SOFT logo"
          />
        </div>
      </div>
    ),
    intents: [
      <TextInput placeholder="(max. 100KB)" />,
      <Button action="/ticker" value="back">
        Back
      </Button>,
      <Button action="/description" value="next">
        Next
      </Button>,
    ],
    title: "Fundcaster by SOFT",
  });
});

app.frame("/description", async (c) => {
  const { buttonValue, inputText, deriveState } = c;
  const state = await deriveState(async (previousState) => {
    if (buttonValue === "next" && inputText && inputText != "") {
      try {
        const url = new URL(decodeURIComponent(inputText));
        const image = await axios.get(url.href, {
          responseType: "arraybuffer",
        });
        const imageBuffer = Buffer.from(image.data, "binary");
        const imageSize = imageBuffer.length / 1000;
        if (imageSize > 100)
          previousState.imageURL =
            "https://soft-pump-assets.s3.amazonaws.com/token.png";
        else {
          previousState.imageURL = decodeURIComponent(inputText);
        }
      } catch (error) {
        previousState.imageURL =
          "https://soft-pump-assets.s3.amazonaws.com/token.png";
      }
    }
  });

  return c.res({
    image: (
      <div
        style={{
          display: "flex",
          height: "100vh",
          width: "100vw",
          alignItems: "flex-start",
          paddingLeft: "60px",
          justifyContent: "center",
          flexDirection: "column",
          backgroundImage: "linear-gradient(to right, #014bad, #17101F)",
        }}
      >
        <div
          style={{
            position: "absolute",
            display: "flex",
            top: "0",
            left: "0",
            padding: "10px",
            color: "white",
            fontSize: "20px",
          }}
        >
          4/6
        </div>
        <h1
          style={{
            textAlign: "center",
            fontSize: "80px",
            margin: "0px",
            color: "white",
          }}
        >
          describe your token
        </h1>
        <p style={{ textAlign: "center", color: "white", fontSize: "30px" }}>
          tell your holders what they're holding
        </p>
        <div
          style={{
            position: "absolute",
            display: "flex",
            bottom: "0",
            right: "0",
            padding: "10px",
          }}
        >
          <img
            src="https://soft-pump-assets.s3.amazonaws.com/bg-blue_fg-white-removebg-preview.png"
            style={{ height: "50px" }}
            alt="SOFT logo"
          />
        </div>
      </div>
    ),
    intents: [
      <TextInput placeholder="(max. 16 characters)" />,
      <Button action="/image" value="back">
        Back
      </Button>,
      <Button action="/supply" value="next">
        Next
      </Button>,
    ],
    title: "Fundcaster by SOFT",
  });
});

app.frame("/supply", (c) => {
  const { buttonValue, inputText, deriveState } = c;
  const state = deriveState((previousState) => {
    if (buttonValue === "next" && inputText)
      previousState.description = decodeURIComponent(inputText);
  });

  return c.res({
    image: (
      <div
        style={{
          display: "flex",
          height: "100vh",
          width: "100vw",
          alignItems: "flex-start",
          paddingLeft: "60px",
          justifyContent: "center",
          flexDirection: "column",
          backgroundImage: "linear-gradient(to right, #014bad, #17101F)",
        }}
      >
        <div
          style={{
            position: "absolute",
            display: "flex",
            top: "0",
            left: "0",
            padding: "10px",
            color: "white",
            fontSize: "20px",
          }}
        >
          5/6
        </div>
        <h1
          style={{
            textAlign: "center",
            fontSize: "80px",
            margin: "0px",
            color: "white",
          }}
        >
          choose a total supply
        </h1>
        <p style={{ textAlign: "center", color: "white", fontSize: "30px" }}>
          make it rain {state.ticker}
        </p>
        <div
          style={{
            position: "absolute",
            display: "flex",
            bottom: "0",
            right: "0",
            padding: "10px",
          }}
        >
          <img
            src="https://soft-pump-assets.s3.amazonaws.com/bg-blue_fg-white-removebg-preview.png"
            style={{ height: "50px" }}
            alt="SOFT logo"
          />
        </div>
      </div>
    ),
    intents: [
      <TextInput placeholder="(max. 1 billion)" />,
      <Button action="/description" value="back">
        Back
      </Button>,
      <Button action="/submit" value="next">
        Preview
      </Button>,
    ],
    title: "Fundcaster by SOFT",
  });
});

app.frame("/submit", (c) => {
  const { buttonValue, inputText, deriveState } = c;
  const state = deriveState((previousState) => {
    if (buttonValue === "next" && inputText)
      if (isNaN(parseInt(inputText))) {
        // make sure input is a number
        previousState.initialSupply = 100;
      } else {
        previousState.initialSupply = parseInt(inputText);
      }
  });

  return c.res({
    action: "/end",
    image: (
      <div
        style={{
          display: "flex",
          height: "100vh",
          width: "100vw",
          alignItems: "flex-start",
          paddingLeft: "60px",
          justifyContent: "center",
          flexDirection: "column",
          backgroundImage: "linear-gradient(to right, #014bad, #17101F)",
        }}
      >
        <div
          style={{
            position: "absolute",
            display: "flex",
            top: "0",
            left: "0",
            padding: "10px",
            color: "white",
            fontSize: "20px",
          }}
        >
          6/6
        </div>
        <h1
          style={{
            textAlign: "center",
            fontSize: "80px",
            margin: "0px",
            color: "white",
          }}
        >
          review details
        </h1>
        <p style={{ textAlign: "center", color: "white", fontSize: "30px" }}>
          name: {state.name}
        </p>
        <p style={{ textAlign: "center", color: "white", fontSize: "30px" }}>
          ticker: {state.ticker}
        </p>
        <p style={{ textAlign: "center", color: "white", fontSize: "30px" }}>
          description: {state.description}
        </p>
        <p style={{ textAlign: "center", color: "white", fontSize: "30px" }}>
          initial supply: {state.initialSupply.toLocaleString("en-US")}
        </p>
        <div
          style={{
            position: "absolute",
            display: "flex",
            bottom: "30%",
            right: "30%",
            backgroundColor: "white",
            borderRadius: "50%",
            padding: "20px",
          }}
        >
          <img
            src={state.imageURL}
            style={{ height: "100px" }}
            alt="token logo"
          />
        </div>
        <div
          style={{
            position: "absolute",
            display: "flex",
            bottom: "0",
            right: "0",
            padding: "10px",
          }}
        >
          <img
            src="https://soft-pump-assets.s3.amazonaws.com/bg-blue_fg-white-removebg-preview.png"
            style={{ height: "50px" }}
            alt="SOFT logo"
          />
        </div>
      </div>
    ),
    intents: [
      <Button action="/supply" value="back">
        Back
      </Button>,
      <Button.Transaction target="/create">Submit</Button.Transaction>,
    ],
    title: "Fundcaster by SOFT",
  });
});

app.frame("/end", async (c) => {
  const state = c.previousState;
  const { deriveState } = c;

  const emptyState = deriveState((previousState) => {
    previousState = {
      name: "",
      ticker: "",
      imageURL: "https://soft-pump-assets.s3.amazonaws.com/token.png",
      description: "",
      initialSupply: parseInt(process.env.DEFAULT_INITIAL_SUPPLY || "1000"),
    };
  });

  let tokenAddress = "";

  try {
    await delay(3000);

    const response = await axios.get(
      `https://api${
        process.env.CHAIN_ID == "84532" ? "-sepolia" : ""
      }.basescan.org/api?module=proxy&action=eth_getTransactionReceipt&txhash=${
        c.transactionId
      }&apikey=${process.env.BASE_SCAN_API_KEY}`
    );

    tokenAddress = response.data.result.logs[0].address;
    const userAddress = response.data.result.from;

    const supabaseURL = process.env.SUPABASE_URL || "";
    const supabaseAnonKey = process.env.SUPABASE_SECRET_KEY || "";
    const supabase = createClient(supabaseURL, supabaseAnonKey);

    const existingToken = await supabase
      .from("tokens")
      .select("contractAddress")
      .eq("contractAddress", tokenAddress);
    if (existingToken.data && existingToken.data.length > 0)
      return displayError(c, "token already exists!");

    const { data, error } = await supabase.from("tokens").insert({
      tokenName: state.name,
      tokenTicker: state.ticker,
      imageURL: state.imageURL,
      description: state.description,
      contractAddress: tokenAddress,
      initialSupply: state.initialSupply,
      userAddress: userAddress,
      txHash: c.transactionId,
      chainId: process.env.CHAIN_ID,
    });

    if (error) return displayError(c, "database error!");
  } catch (error) {
    return displayError(c, "failed to fetch address!");
  }

  return c.res({
    image: (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundImage: "linear-gradient(to right, #014bad, #17101F)",
        }}
      >
        <h1 style={{ color: "white", fontSize: "80px", margin: "0px" }}>
          {tokenAddress ? "token created!" : "token creation failed!"}
        </h1>
        <p style={{ color: "white", fontSize: "25px", margin: "0px" }}>
          {tokenAddress
            ? `add your token to your wallet with the address from basescan`
            : "try again"}
        </p>
      </div>
    ),
    intents: tokenAddress
      ? [
          <Button.Link href="https://www.thesoftdao.com/">
            More by SOFT
          </Button.Link>,
          <Button.Link href={`https://basescan.org/token/${tokenAddress}`}>
            BaseScan
          </Button.Link>,
          <Button.Reset>Restart</Button.Reset>,
        ]
      : [
          <Button.Link href="https://www.thesoftdao.com/">
            More by SOFT
          </Button.Link>,
          <Button.Reset>Restart</Button.Reset>,
        ],
    title: "Fundcaster by SOFT",
  });
});

app.transaction("/create", async (c) => {
  const state = c.previousState;

  const supply = new BigNumber(state.initialSupply).multipliedBy(
    new BigNumber(10).pow(18)
  );

  return c.contract({
    abi: ABI,
    chainId: `eip155:${process.env.CHAIN_ID}` as
      | "eip155:1"
      | "eip155:10"
      | "eip155:8453"
      | "eip155:84532"
      | "eip155:7777777"
      | "eip155:666666666",
    functionName: "CreateNewCustomToken",
    to: process.env.TOKEN_FACTORY_ADDRESS as `0x${string}`,
    args: [
      state.name,
      state.ticker,
      supply.toFixed(),
      process.env.FEE_DEPOSIT_ADDRESS,
    ],
  });
});

const displayError = (c: any, error: string) => {
  return c.res({
    image: (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundImage: "linear-gradient(to right, #014bad, #17101F)",
        }}
      >
        <h1 style={{ color: "white", fontSize: "80px", margin: "0px" }}>
          {error}
        </h1>
      </div>
    ),
    intents: [
      <Button.Link href="https://www.thesoftdao.com/">
        More by SOFT
      </Button.Link>,
      <Button.Reset>Restart</Button.Reset>,
    ],
    title: "Fundcaster by SOFT",
  });
};

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
