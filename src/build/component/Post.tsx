import TopComponent from "./Top";
import HTML from "@kitajs/html";

export default function PostComponent(props: {
  title: string;
  children: HTML.Children;
}) {
  return (
    <TopComponent
      resource_name={props.title}
      content_head={
        <>
          <link rel="stylesheet" href="Post.css" />
        </>
      }
    >
      {props.children}
    </TopComponent>
  );
}
