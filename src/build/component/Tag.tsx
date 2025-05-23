import { encodeURIComponent_id } from "@/util";
import Icon from "@/build/component/Icon";

export default function Tag(props: { tag: string }) {
  const id = encodeURIComponent_id(props.tag);
  return (
    <a class="Tag" href={`Tags.html#${id}`}>
      <Icon.Tag />
      <div safe>{props.tag}</div>
    </a>
  );
}
