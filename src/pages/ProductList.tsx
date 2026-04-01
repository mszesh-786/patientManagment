import { products } from "./data";
import { useEffect, useState, useMemo } from "react";

function useDebounce(value: string, delay: number): string {
  const [debounceValue, setDebounceValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounceValue;
}

const ProductList = () => {
  const categories = products.map((prod) => prod.category);
  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(categories));
  }, []);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortName, setSortName] = useState("");
  const [sortPrice, setSortPrice] = useState("");
  const [formDate, setFormDate] = useState("");
  const [toDate, setToDate] = useState("");
  const debouncedQuery = useDebounce(searchValue, 500);
  const { protocol, pathname, host } = window.location;
  const filterUrl = `${protocol}//${host}${pathname}`;

  const getQuery = () => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search);
    }
    return new URLSearchParams();
  };

  const setQueryParam = (
    key: string,
    value: string,
    options?: { replace?: boolean },
  ) => {
    const query = getQuery();
    query.set(key, value);
    const newUrl = `${filterUrl}?${query.toString()}`;
    if (options?.replace) {
      window.history.replaceState({}, "", newUrl);
    } else {
      window.history.pushState({}, "", newUrl);
    }
  };
  useEffect(() => {
    clearQueryParam("search");
    clearQueryParam("category");
    clearQueryParam("sort");
    clearQueryParam("from");
    clearQueryParam("to");
  }, []);

  const clearQueryParam = (key: string) => {
    const query = getQuery();
    query.delete(key);
    const newUrl = query.toString()
      ? `${filterUrl}?${query.toString()}`
      : filterUrl;
    window.history.replaceState({}, "", newUrl);
  };
  const filteredProducts = useMemo(() => {
    let result = [...products];
    const query = debouncedQuery?.trim().toLowerCase();
    if (query) {
      result = result.filter((pro) => pro.name.toLowerCase().includes(query));
    }
    if (selectedCategory !== "all") {
      result = result.filter(
        (product) => product.category === selectedCategory,
      );
    }
    if (sortName) {
      result.sort((a, b) =>
        sortName === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name),
      );
      if(sortPrice) {
        result.sort((a,b)=> 
          sortPrice === "asc" ? a.price - b.price : b.price-a.price
        )
      }
    }
    return result;
  }, [sortName, sortPrice, debouncedQuery, selectedCategory]);

  useEffect(() => {
    const query = debouncedQuery?.trim().toLowerCase();
    const filtered = !query
      ? products
      : products.filter((pro) => pro.name.toLowerCase().includes(query));

    if (query) {
      setQueryParam("search", query, { replace: true });
    } else {
      clearQueryParam("search");
    }
  }, [debouncedQuery, products]);
  /* 
  const handleCategory = (option: React.ChangeEvent<HTMLSelectElement>) => {
    const value = option.target.value;
    if (value === "all") {
      clearQueryParam("category");
      setFilteredProducts(products);
    } else {
      setQueryParam("category", value, { replace: true });
      setFilteredProducts(products.filter((pro) => pro.category === value));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (debouncedQuery.trim() === "") {
      clearQueryParam("search");
      setFilteredProducts(products);
    } else {
      setQueryParam("search", debouncedQuery.trim());
      setFilteredProducts(
        products.filter((pro) => pro.name === debouncedQuery.trim()),
      );
    }
  };

  const handleSort = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setFilteredProducts(
        [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name)),
      );
      setQueryParam("sort", "ASC");
    } else {
      setFilteredProducts(
        [...filteredProducts].sort((a, b) => b.name.localeCompare(a.name)),
      );
      setQueryParam("sort", "DESC");
    }
  };

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fromDate = e.target.value ? new Date(e.target.value).getTime() : null;
    if (fromDate) {
      setFilteredProducts(
        products.filter((prod) => prod.fromDate.getTime() >= fromDate),
      );
      setQueryParam("from", e.target.value);
    } else {
      clearQueryParam("from");
      setFilteredProducts(products);
    }
  };

  const handleToDateChange = (e) => {
    const toDate = e.target.value ? new Date(e.target.value) : null;
    if (toDate) {
      setFilteredProducts(
        products.filter((prod) => prod.toDate <= toDate),
      );
      setQueryParam("to", e.target.value);
    } else {
      clearQueryParam("to");
      setFilteredProducts(products);
    }
  };

  const handleSortByPrice = (e) => {
    if (e.target.checked) {
      setFilteredProducts(
        [...filteredProducts].sort((a, b) => a.price - b.price),
      );
    } else {
      setFilteredProducts(
        [...filteredProducts].sort((a, b) => b.price - a.price),
      );
    }
  }; */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  const toggleSortName = () => {
    setSortName((prev) => {
      if (prev === "") return "asc";
      if (prev === "asc") return "desc";
      return "";
    });
  };
  const toggleSortPrice = () => {
    setSortName((prev) => {
      if (prev === "") return "asc";
      if (prev === "asc") return "desc";
      return "";
    });
  };
  return (
    <form onSubmit={handleSubmit} noValidate>
      <h3>Produst List</h3>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "1rem",
          width: "1000px",
        }}
      >
        <input
          onChange={(e) => setSearchValue(e.target.value)}
          style={{
            width: "100%",
            height: "50px",
            borderRadius: "5px",
            marginBottom: "1rem",
            padding: "5px",
          }}
          placeholder="Search products..."
        />

        <fieldset>
          Category
          <select
            style={{ display: "flex", flexDirection: "column" }}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option defaultValue="all" defaultChecked value="all">
              All
            </option>

            {uniqueCategories.map((prod) => {
              return (
                <>
                  <option value={prod}>{prod}</option>
                </>
              );
            })}
          </select>
        </fieldset>

        <fieldset>
          <input onChange={toggleSortName} type="checkbox" />
          <label style={{ marginLeft: "5px" }}>Sort by name</label>
        </fieldset>

        <fieldset>
          <input onChange={toggleSortPrice} type="checkbox" />
          <label style={{ marginLeft: "5px" }}>Sort by Price</label>
        </fieldset>
        <fieldset>
          <label style={{ marginRight: "5px" }}>From Date</label>
          <input type="date" onChange={(e) => setFormDate(e.target.value)} />
        </fieldset>
        <fieldset>
          <label style={{ marginRight: "5px" }}>To Date</label>
          <input
            type="date"
            onChange={(e) => {
              e.target.value;
            }}
          />
        </fieldset>
      </div>

      <table style={{ width: "100%" }}>
        <tr>
          <th> id </th>
          <th>Name</th>
          <th scope="col">Category</th>
          <th scope="col">Price</th>
          <th scope="col">InStock</th>
          <th scope="col">From Date</th>
          <th scope="col">To Date</th>
        </tr>
        <tbody>
          {filteredProducts.length === 0 && (
            <tr>
              <td colSpan={7} style={{ textAlign: "center" }}>
                No products found.
              </td>
            </tr>
          )}
          {filteredProducts.map((prod) => (
            <tr key={prod.id}>
              <td>{prod.id}</td>
              <td>{prod.name}</td>
              <td>{prod.category}</td>
              <td>{prod.price}</td>
              <td style={{ backgroundColor: prod.inStock ? "green" : "red" }}>
                {prod.inStock ? "YES" : "No"}
              </td>
              <td>{prod.fromDate.toLocaleDateString()}</td>
              <td>{prod.toDate.toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </form>
  );
};

export default ProductList;
