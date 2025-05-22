import TopComponent from "./Top";
import HTML from "@kitajs/html";

export default function PostComponent(props: {
  title: string;
  children: HTML.Children;
}) {
  return (
    <TopComponent title={props.title} content_head={<></>}>
      <article>{props.children}</article>
    </TopComponent>
  );
}
