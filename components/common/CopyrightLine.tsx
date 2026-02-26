"use client";

export default function CopyrightLine() {
  return (
    <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm ">
      © {new Date().getFullYear()} Deals Mocktail. All rights reserved.
    </div>
  );
}
