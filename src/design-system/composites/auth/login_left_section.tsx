import React from "react";
import styles from "./LoginLeftSection.module.scss";

type CoinSlot =
  | "coinUD" | "coinENS" | "coinStarknet" | "coinTezos"
  | "coinBNB" | "coinDark" | "coinArbitrum";

const COINS: { src: string; alt: string; slot: CoinSlot }[] = [
  { src: "/wallet-login/coin_icons/Avatar.png",     alt: "Unstoppable Domains", slot: "coinUD"       },
  { src: "/wallet-login/coin_icons/token.png",      alt: "ENS",                 slot: "coinENS"      },
  { src: "/wallet-login/coin_icons/token (1).png",  alt: "Starknet",            slot: "coinStarknet" },
  { src: "/wallet-login/coin_icons/Tezos.png",      alt: "Tezos",               slot: "coinTezos"    },
  { src: "/wallet-login/coin_icons/token (2).png",  alt: "BNB",                 slot: "coinBNB"      },
  { src: "/wallet-login/coin_icons/token (3).png",  alt: "Dark token",          slot: "coinDark"     },
  { src: "/wallet-login/coin_icons/Avatar (1).png", alt: "Arbitrum",            slot: "coinArbitrum" },
];

const LoginLeftSection: React.FC = () => (
  <section className={styles.container}>

    {/* Border frame around heading */}
    <img
      src="/wallet-login/logoanddesigns/border.svg"
      alt=""
      className={styles.headingBorder}
      aria-hidden="true"
    />

    <p className={styles.heading}>
      Your one-stop platform to buy, register, and manage web3 digital identities
    </p>

    {/* Blue gradient diamond shape behind the coin arc */}
    <img
      src="/wallet-login/logoanddesigns/gradientdiamond.svg"
      alt=""
      className={styles.gradientDiamond}
      aria-hidden="true"
    />

    {/* One grey vertical bar per coin column */}
    <div className={styles.coinBarsArea} aria-hidden="true">
      {COINS.map(({ slot }) => (
        <div
          key={`bar-${slot}`}
          className={`${styles.coinBar} ${(styles as Record<string, string>)[slot]}`}
        >
          <img
            src="/wallet-login/logoanddesigns/greyrectangles.svg"
            alt=""
            className={styles.coinBarImg}
          />
        </div>
      ))}
    </div>

    {/* Animated coin icons */}
    <div className={styles.coinsArea} aria-hidden="true">
      {COINS.map(({ src, alt, slot }) => (
        <div
          key={slot}
          className={`${styles.coin} ${(styles as Record<string, string>)[slot]}`}
        >
          <img
            src={src}
            alt={alt}
            className={`${styles.coinImg}${slot === "coinTezos" ? ` ${styles.coinImgTezos}` : ""}`}
          />
        </div>
      ))}
    </div>

    {/* Border frame around 3D logo */}
    <img
      src="/wallet-login/logoanddesigns/border.svg"
      alt=""
      className={styles.logoBorder}
      aria-hidden="true"
    />

    <img
      src="/wallet-login/logoanddesigns/endless-3d-logo.png"
      alt="Endless Domains"
      className={styles.logo3d}
    />

    <img
      src="/wallet-login/logoanddesigns/lastdesigngroup.svg"
      alt=""
      className={styles.platform}
      aria-hidden="true"
    />
  </section>
);

export default LoginLeftSection;
