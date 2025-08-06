"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useActionState, useState } from "react";
import { motion } from "motion/react";

import searchImg from "@/assets/UI/search-icon.svg";
import closeIcon from "@/assets/UI/close-icon.svg";

function SearchOrdersForm({ activeFilter, searchFilter }) {
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter");

  const [searchFilterValue, setSearchFilterValue] = useState(
    searchFilter || ""
  );
  const [formState, formAction] = useActionState(searchOrders, {});

  function searchOrders(prevState, formData) {
    const params = new URLSearchParams(searchParams.toString());
    const filterName = formData.get("searchFilter");

    params.set("searchFilter", filterName);

    if (filter) {
      params.set("filter", filter);
    }

    const newUrl = `${path}?${params.toString()}`;
    router.replace(newUrl);

    return {};
  }

  function handleClearClick() {
    const params = new URLSearchParams(searchParams.toString());
    setSearchFilterValue("");

    params.delete("searchFilter");

    if (filter) {
      params.delete("filter");
    }

    const newUrl = `${path}?${params.toString()}`;
    router.replace(newUrl);
  }

  return (
    <motion.form action={formAction} id="search-form">
      <motion.input
        type="text"
        name="searchFilter"
        id="searchFilter"
        placeholder={`Search ${activeFilter || "all"} orders...`}
        value={searchFilterValue}
        onChange={(e) => setSearchFilterValue(e.target.value)}
        style={{ originX: 1 }}
        initial={{
          opacity: 0,
          width: 0,
        }}
        animate={{
          opacity: 1,
          width: "195px",
        }}
        exit={{
          opacity: 0,
          width: 0,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
      <img src={closeIcon.src} alt="close-icon" onClick={handleClearClick} />
      <motion.button
        type="submit"
        initial={{
          opacity: 0,
          scale: 0.5,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          scale: 0.5,
        }}
        transition={{ duration: 0.4, ease: "easeOut", type: "spring" }}
      >
        <Image src={searchImg} alt="searchImg" />
      </motion.button>
    </motion.form>
  );
}

export default SearchOrdersForm;
