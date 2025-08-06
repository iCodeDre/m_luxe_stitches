"use client";

import Image from "next/image";
import searchImg from "@/assets/UI/search-icon.svg";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import NProgress from "nprogress";

function SearchForm({
  onChange,
  onSelectChange,
  selectedCategory,
  categories,
}) {
  const router = useRouter();
  const searchCategory = useRef();
  const lastChange = useRef();
  const inputValue = useRef();

  const [categoryName, setCategoryName] = useState(selectedCategory);

  function handleChange(event) {
    if (lastChange.current) {
      clearTimeout(lastChange.current);
    }

    lastChange.current = setTimeout(() => {
      lastChange.current = null;
      onChange(event, searchCategory.current.value);
    }, 1000);
  }
  function handleSelectChange() {
    if (inputValue.current.value) {
      console.log("ref", inputValue.current.value);
      onSelectChange(inputValue.current.value, searchCategory.current.value);
    }

    setCategoryName(searchCategory.current.value);
  }

  function handleSearchSubmit() {
    const searchTerm = inputValue.current.value;
    const searchCat = searchCategory.current.value;

    if (!searchTerm) return;
    NProgress.start();
    router.replace(`/search/${searchTerm}?searchCat=${searchCat}`);
  }

  return (
    <form id="search-form">
      <input
        type="text"
        name="searchValue"
        id="searchValue"
        placeholder="Search products and categories..."
        onChange={handleChange}
        ref={inputValue}
      />
      <select
        ref={searchCategory}
        name="searchCategory"
        value={categoryName || "all"}
        id="searchCategory"
        onChange={handleSelectChange}
      >
        <option value="all">All categories</option>
        {categories.map((category) => (
          <option key={category.name} value={`${category.name}`}>
            {category.name}
          </option>
        ))}
      </select>

      <button type="button" onClick={handleSearchSubmit}>
        <Image src={searchImg} alt="searchImg" />
      </button>
    </form>
  );
}

export default SearchForm;
