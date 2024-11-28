import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const fontsList = [roboto.style.fontFamily].join(",");

export const fontsName = {
  roboto: roboto.style.fontFamily,
};
