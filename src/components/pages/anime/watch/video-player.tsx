"use client";

import React, { useEffect, useMemo, useRef } from "react";
import Artplayer from "artplayer";
import Hls from "hls.js";
import artplayerPluginHlsControl from "artplayer-plugin-hls-control";
import artplayerPluginChapter from "artplayer-plugin-chapter";
import type { Option as ArtPlayerOption } from "artplayer/types/option";

export interface SourceData {
  intro?: {
    start: number;
    end: number;
  };
  outro?: {
    start: number;
    end: number;
  };
  sources: Array<{
    url: string;
    quality?: string;
  }>;
  tracks: Array<{
    file: string;
    kind?: string;
    label?: string;
    default?: boolean;
  }>;
}

interface VideoPlayerProps {
  option: Partial<ArtPlayerOption>;
  sourceData: SourceData;
  getInstance?: (art: Artplayer) => void;
  className?: string;
  controlsZIndex?: number;
}

interface Level {
  height: number;
}

interface Track {
  name: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  option,
  sourceData,
  getInstance,
  className,
  controlsZIndex = 25,
}) => {
  const artRef = useRef<Artplayer>();
  const containerRef = useRef<HTMLDivElement>(null);

  const proxyUrl = useMemo(() => {
    return (url: string) => {
      if (url.startsWith("/api/proxy")) {
        return url;
      }
      if (url.includes("netmagcdn")) {
        return `/api/proxy?url=${encodeURIComponent(url)}`;
      }
      return url;
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create chapters based on sourceData
    const chapters = [];
    if (
      sourceData?.intro &&
      !(sourceData.intro.start === 0 && sourceData.intro.end === 0)
    ) {
      chapters.push({
        start: sourceData.intro.start,
        end: sourceData.intro.end,
        title: "Intro",
      });
    }
    if (
      sourceData?.outro &&
      !(sourceData.outro.start === 0 && sourceData.outro.end === 0)
    ) {
      chapters.push({
        start: sourceData.outro.start,
        end: sourceData.outro.end,
        title: "Outro",
      });
    }

    // Create the chapters plugin
    const chapterPlugin = artplayerPluginChapter({
      chapters,
    });

    const art = new Artplayer({
      container: containerRef.current,
      url: "",
      setting: true,
      loop: false,
      playbackRate: true,
      fullscreen: true,
      subtitleOffset: true,
      mutex: true,
      backdrop: true,
      playsInline: true,
      autoPlayback: true,
      airplay: true,
      theme: "#FAFAFA",
      moreVideoAttr: {
        // crossOrigin: "anonymous",
      },
      plugins: [
        artplayerPluginHlsControl({
          quality: {
            setting: true,
            getName: (level: Level) => level.height + "P",
            title: "Quality",
            auto: "Auto",
          },
          audio: {
            control: true,
            setting: true,
            getName: (track: Track) => track.name,
            title: "Audio",
            auto: "Auto",
          },
        }),
        ...(chapters.length > 0 ? [chapterPlugin] : []),
      ],
      customType: {
        m3u8: function playM3u8(
          video: HTMLVideoElement,
          url: string,
          art: Artplayer
        ) {
          if (Hls.isSupported()) {
            if (art.hls) art.hls.destroy();
            const hls = new Hls();
            hls.loadSource(proxyUrl(url));
            hls.attachMedia(video);
            art.hls = hls;
            art.on("destroy", () => hls.destroy());
          } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = url;
          } else {
            art.notice.show = "Unsupported playback format: m3u8";
          }
        },
      },
      ...option,
    });

    // Apply custom z-index to controls after initialization
    const controls = art.template.$player;
    if (controls) {
      controls.style.zIndex = controlsZIndex.toString();
    }

    // Add CSS to ensure controls are properly layered
    const style = document.createElement("style");
    style.textContent = `
      .art-video-player .art-controls {
        z-index: ${controlsZIndex} !important;
      }
      .art-video-player .art-bottom {
        z-index: ${controlsZIndex + 1} !important;
      }
      .art-video-player .art-settings {
        z-index: ${controlsZIndex + 2} !important;
      }
    `;
    document.head.appendChild(style);

    artRef.current = art;
    getInstance?.(art);

    return () => {
      if (artRef.current) {
        artRef.current.destroy();
        artRef.current = undefined;
      }
      // Clean up added style
      style.remove();
    };
  }, [option, getInstance, sourceData, controlsZIndex]);

  return <div ref={containerRef} className={className} />;
};

export default VideoPlayer;
