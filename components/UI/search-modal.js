"use client";

import Image from "next/image";

import { useEffect, useState } from "react";

import classes from "./search-modal.module.css";

import SearchForm from "@/components/UI/search-form";
import Modal from "@/components/UI/modal";
import { getsuggestedResults } from "@/actions/search-actions";
import LinkWithProgress from "./link-with-progress";
import NoProducts from "./no-items/no-products";

function SearchModal({ onClose, categories }) {
  const [search, setSearch] = useState({
    searchTerm: "",
    categoryTerm: "",
  });

  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    async function getSuggestions(searchTerm, categoryTerm) {
      if (searchTerm) {
        const results = await getsuggestedResults(searchTerm, categoryTerm);
        setSearchResult(results);
        return;
      }

      setSearchResult([]);
    }

    getSuggestions(search.searchTerm, search.categoryTerm);
  }, [search]);

  function handleSearchChange(event, searchCategory) {
    const searchTerm = event.target.value;

    setSearch((prev) => {
      return {
        ...prev,
        searchTerm: searchTerm,
        categoryTerm: searchCategory,
      };
    });
  }

  function handleSelectChange(searchTerm, searchCategory) {
    console.log("modal", searchTerm, searchCategory);

    setSearch((prev) => {
      return {
        ...prev,
        searchTerm: searchTerm,
        categoryTerm: searchCategory,
      };
    });
  }

  return (
    <Modal onClose={onClose}>
      <SearchForm
        onChange={handleSearchChange}
        onSelectChange={handleSelectChange}
        selectedCategory={search.categoryTerm}
        categories={categories}
      
      />
      {searchResult.length !== 0 && (
        <ul
          className={
            searchResult.length <= 5
              ? classes.searchItemListContainer
              : `${classes.searchItemListContainer} ${classes.scrollBar}`
          }
        >
          {searchResult.map((result) => (
            <li key={result.product_id}>
              <LinkWithProgress href={`/products/${result.slug}`}>
                <header>
                  <span>
                    <Image src={result.image_url[0]} alt="product-image" sizes="40" fill />
                  </span>
                  <h1>{result.title}</h1>
                </header>
                <p className={classes.price}>{result.price}</p>
              </LinkWithProgress>
            </li>
          ))}
        </ul>
      )}
      {searchResult.length < 1 && search.searchTerm ? (
        <NoProducts  style={{marginTop: '2rem', color: 'red'}}>Sorry, no products found</NoProducts>
      ) : null}
      {searchResult.length < 1 && !search.searchTerm ? (
        <NoProducts style={{marginTop: '2rem'}}>Input product to search</NoProducts>
      ) : null}
    </Modal>
  );
}

export default SearchModal;
