import { Setting, Settings } from "./settings";

export async function getBrightnessBarHTML(props: {
  settings: Settings;
  brightness: number;
  animate: boolean;
  reverse?: boolean;
}) {
  const [
    barColor,
    emptyBarColor,
    containerColor,
    iconColor,
    containerRadius,
    containerShadow,
  ] = await Promise.all([
    props.settings.load(Setting.BarColor),
    props.settings.load(Setting.EmptyBarColor),
    props.settings.load(Setting.ContainerColor),
    props.settings.load(Setting.IconColor),
    props.settings.load(Setting.ContainerRadius),
    props.settings.load(Setting.ContainerShadow),
  ]);

  const animation = props.animate
    ? props.reverse
      ? "from { transform: translateY(0) } to { transform: translateY(-150%) }"
      : "from { transform: translateY(-150%) } to { transform: translateY(0) }"
    : "";

  return `
    <style>
      @keyframes brightness_bar_anim {
        ${animation}
      }

      .brightness_bar_container {
        background: ${containerColor};
        color: ${iconColor};
        box-shadow: ${
          containerShadow ? "0px 0px 10px rgb(0 0 0 / 50%)" : "none"
        };
        border-radius: ${containerRadius};
        width: 236px;
        position: absolute;
        top: 8px;
        left: 8px;
        animation: brightness_bar_anim 0.22s cubic-bezier(0, 0.73, 0.48, 1) forwards;
        display: flex;
        flex-direction: row;
        gap: 12px;
        align-items: center;
        flex-wrap: nowrap;
        padding-left: 16px;
        padding-right: 16px;
        padding-top: 7px;
        padding-bottom: 7px;
      }

      .brightness_bar_icon {
        width: 20px;
      }

      .brightness_bar {
        flex-grow: 1;
        height: 6px;
        background-color: ${emptyBarColor};
        border-radius: 3px;
      }

      .brightness_bar span {
        display: block;
        height: 100%;
        width: ${props.brightness}%;
        background-color: ${barColor};
        border-radius: 3px;
      }
    </style>
    <div style="position: relative">
      <div class="brightness_bar_container">
        <div class="brightness_bar_icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" fill="none">
          <path
            d="M25 18C25 19.3845 24.5895 20.7378 23.8203 21.889C23.0511 23.0401 21.9579 23.9373 20.6788 24.4672C19.3997 24.997 17.9922 25.1356 16.6344 24.8655C15.2765 24.5954 14.0292 23.9287 13.0503 22.9497C12.0713 21.9708 11.4046 20.7235 11.1345 19.3656C10.8644 18.0078 11.003 16.6003 11.5328 15.3212C12.0627 14.0421 12.9599 12.9489 14.111 12.1797C15.2622 11.4105 16.6155 11 18 11C19.8565 11 21.637 11.7375 22.9497 13.0503C24.2625 14.363 25 16.1435 25 18ZM18 8C18.5304 8 19.0391 7.78929 19.4142 7.41421C19.7893 7.03914 20 6.53043 20 6V2H16V6C16 6.53043 16.2107 7.03914 16.5858 7.41421C16.9609 7.78929 17.4696 8 18 8ZM27.9 10.93L30.73 8.1L27.9 5.27L25.07 8.1C24.8842 8.28582 24.7368 8.50642 24.6362 8.74921C24.5356 8.99199 24.4839 9.25221 24.4839 9.515C24.4839 9.77779 24.5356 10.038 24.6362 10.2808C24.7368 10.5236 24.8842 10.7442 25.07 10.93C25.2558 11.1158 25.4764 11.2632 25.7192 11.3638C25.962 11.4644 26.2222 11.5161 26.485 11.5161C26.7478 11.5161 27.008 11.4644 27.2508 11.3638C27.4936 11.2632 27.7142 11.1158 27.9 10.93ZM30 16C29.4696 16 28.9609 16.2107 28.5858 16.5858C28.2107 16.9609 28 17.4696 28 18C28 18.5304 28.2107 19.0391 28.5858 19.4142C28.9609 19.7893 29.4696 20 30 20H34V16H30ZM25.07 25.07C24.884 25.2557 24.7365 25.4763 24.6359 25.7191C24.5352 25.9619 24.4834 26.2222 24.4834 26.485C24.4834 26.7478 24.5352 27.0081 24.6359 27.2509C24.7365 27.4937 24.884 27.7143 25.07 27.9L27.9 30.73L30.73 27.9L27.9 25.07C27.7143 24.884 27.4937 24.7365 27.2509 24.6359C27.0081 24.5352 26.7478 24.4834 26.485 24.4834C26.2222 24.4834 25.9619 24.5352 25.7191 24.6359C25.4763 24.7365 25.2557 24.884 25.07 25.07ZM18 28C17.4696 28 16.9609 28.2107 16.5858 28.5858C16.2107 28.9609 16 29.4696 16 30V34H20V30C20 29.4696 19.7893 28.9609 19.4142 28.5858C19.0391 28.2107 18.5304 28 18 28ZM8.1 25.07L5.27 27.9L8.1 30.73L10.93 27.9C11.1158 27.7142 11.2632 27.4936 11.3638 27.2508C11.4644 27.008 11.5161 26.7478 11.5161 26.485C11.5161 26.2222 11.4644 25.962 11.3638 25.7192C11.2632 25.4764 11.1158 25.2558 10.93 25.07C10.7442 24.8842 10.5236 24.7368 10.2808 24.6362C10.038 24.5356 9.77779 24.4839 9.515 24.4839C9.25221 24.4839 8.99199 24.5356 8.74921 24.6362C8.50642 24.7368 8.28582 24.8842 8.1 25.07ZM8 18C8 17.4696 7.78929 16.9609 7.41421 16.5858C7.03914 16.2107 6.53043 16 6 16H2V20H6C6.53043 20 7.03914 19.7893 7.41421 19.4142C7.78929 19.0391 8 18.5304 8 18ZM10.93 10.93C11.116 10.7443 11.2635 10.5237 11.3641 10.2809C11.4648 10.0381 11.5166 9.77783 11.5166 9.515C11.5166 9.25217 11.4648 8.99191 11.3641 8.74912C11.2635 8.50632 11.116 8.28575 10.93 8.1L8.1 5.27L5.27 8.1L8.1 10.93C8.28575 11.116 8.50632 11.2635 8.74912 11.3641C8.99191 11.4648 9.25217 11.5166 9.515 11.5166C9.77783 11.5166 10.0381 11.4648 10.2809 11.3641C10.5237 11.2635 10.7443 11.116 10.93 10.93Z"
            fill="currentColor"
          ></path>
        </svg>
        </div>
        <div class="brightness_bar">
          <span />
        </div>
      </div>
    </div>
  `;
}
