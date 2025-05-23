import HTML from "@kitajs/html";
import Header from "@/build/component/Header";
import Footer from "@/build/component/Footer";
import config from "@/config.json";

export default function TopComponent(props: {
  resource_name: string;
  content_head: JSX.Element;
  children: HTML.Children;
}): JSX.Element {
  return (
    <>
      {"<!doctype html>"}
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title safe>
            {config.website_name} | {props.resource_name}
          </title>
          <link rel="stylesheet" href="common.css" />
          <link rel="stylesheet" href="Top.css" />
          <link rel="stylesheet" href="Header.css" />
          <link rel="stylesheet" href="Footer.css" />
          <link rel="stylesheet" href="Raindrops.css" />
          <link rel="stylesheet" href="Markdown.css" />
          <link rel="stylesheet" href="Tag.css" />
          {props.content_head as "safe"}
        </head>
        <body>
          <Raindrops />
          <Header resource_name={props.resource_name} />
          <main>{props.children}</main>
          <Footer />
        </body>
      </html>
    </>
  );
}

function Raindrops(props: {}) {
  return (
    <div id="raindrop_container">
      <div class="raindrop"></div>
      <div class="raindrop"></div>
      <div class="raindrop"></div>
      <div class="raindrop"></div>
      <div class="raindrop"></div>
      <div class="raindrop"></div>
      <div class="raindrop"></div>
      <div class="raindrop"></div>
      <div class="raindrop"></div>
      <div class="raindrop"></div>
      <div class="raindrop"></div>
      <div class="raindrop"></div>
      <div class="raindrop"></div>
      <div class="raindrop"></div>
      <div class="raindrop"></div>
      <div class="raindrop"></div>
      <div class="raindrop"></div>
      <div class="raindrop"></div>
      <div class="raindrop"></div>
      <div class="raindrop"></div>
      <div class="raindrop"></div>
      <div class="raindrop"></div>
      <div class="raindrop"></div>
      <div class="raindrop"></div>
      <div class="raindrop"></div>
      <div class="raindrop"></div>
      <div class="raindrop"></div>
      <div class="raindrop"></div>
      <div class="raindrop"></div>
      <div class="raindrop"></div>
      <div class="raindrop"></div>
      <div class="raindrop"></div>
      <div class="raindrop"></div>
      <div class="raindrop"></div>
      <div class="raindrop"></div>
      <div class="raindrop"></div>
      <div class="raindrop"></div>
      <div class="raindrop"></div>
      <div class="raindrop"></div>
      <div class="raindrop"></div>
    </div>
  );
}
