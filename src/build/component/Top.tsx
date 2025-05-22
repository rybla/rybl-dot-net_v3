import HTML from "@kitajs/html";

export default function TopComponent(props: {
  title: string;
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
          <title safe>{props.title}</title>
          <link rel="stylesheet" href="Top.css" />
          {props.content_head as "safe"}
        </head>
        <body>
          <main>{props.children}</main>
        </body>
      </html>
    </>
  );
}
