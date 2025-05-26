import config from "@/config.json";
import Icon from "@/build/component/Icon";

export default function Header(props: { resource_name: string }) {
  return (
    <header>
      <div class="logo">
        <img src="profile.png" />
      </div>
      <div class="name">
        <div class="website_name">
          <a href="/" safe>
            {config.website_name}
          </a>
        </div>
        <div class="separator" />
        <div class="resource_name">
          <div safe>{props.resource_name}</div>
        </div>
      </div>
      <div class="menu">
        <a href="index.html" class="item">
          <Icon.Library />
        </a>
        <a href="Tags.html" class="item">
          <Icon.Tag />
        </a>
        <a href="About.html" class="item">
          <Icon.Info />
        </a>
        <a href="https://github.com/rybla/" class="item">
          <Icon.GitHub />
        </a>
      </div>
    </header>
  );
}
