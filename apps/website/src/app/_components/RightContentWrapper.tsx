"use client";
import dynamic from "next/dynamic";
const RightContentWrapper = dynamic(() => import("./RightContent"), {
  ssr: false,
});

export default RightContentWrapper;
