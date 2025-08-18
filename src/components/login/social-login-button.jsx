// src/components/login/social-login-button.jsx

import React from "react";

export default function SocialLoginButton({
    Icon,
    imgSrc,
    bgColor = "#fff",
    iconColor,
    size = 50,
    iconSize = 24,
    bordered = false,
    onClick,
    alt,
}) {
    return (
        <button
            type="button"
            aria-label={alt}
            onClick={onClick}
            className="flex items-center justify-center rounded-full"
            style={{
                width: size,
                height: size,
                backgroundColor: bgColor,
                border: bordered ? "1px solid #E6E6E6" : "none",
            }}
        >
            {Icon ? (
                <Icon
                    size={iconSize}
                    style={iconColor ? { color: iconColor } : undefined}
                />
            ) : imgSrc ? (
                <img
                    src={imgSrc}
                    alt={alt}
                    style={{
                        width: iconSize,
                        height: iconSize,
                        objectFit: "contain",
                    }}
                    draggable="false"
                />
            ) : null}
        </button>
    );
}
