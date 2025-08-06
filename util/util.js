import { logout } from "@/actions/auth-actions";
import { toast } from "sonner";

export function getPath(path, sub = false) {
  const pathSegment = path.split("/").filter(Boolean);
  let pathName;

  if (pathSegment.includes("categories") && !pathSegment.includes("search")) {
    pathName = pathSegment[pathSegment.length - 1];
  } else if (pathSegment.includes("search")) {
    console.log(pathName);
    pathName = `${pathSegment[0]} Results: ${pathSegment[1]}`;
  } else if (
    pathSegment.includes("cart") ||
    pathSegment.includes("checkout") ||
    pathSegment.includes("order-complete")
  ) {
    return (pathName = ["cart", "checkout", "Order Complete"]);
  } else if (
    pathSegment.includes("my-account") &&
    !pathSegment.includes("my-wishlist")
  ) {
    pathName = "my account";
  } else if (
    pathSegment.includes("my-account") &&
    pathSegment.includes("my-wishlist")
  ) {
    pathName = "my wishlist";
  } else {
    pathName = pathSegment[0];
  }

  return pathName.charAt(0).toUpperCase() + pathName.slice(1);
}

export function getPageDetails(resolvedSearchParams) {
  const pageNo = resolvedSearchParams.page || "1";
  const currentPage = +pageNo;
  const sort = resolvedSearchParams.sortBy || "default";
  const offsetValue = currentPage * 12 - 12;

  return {
    currentPage,
    sort,
    offsetValue,
  };
}

export function getProfilePageDetails(resolvedSearchParams) {
  const pageNo = resolvedSearchParams.page || "1";
  const currentPage = +pageNo;
  const filterValue = resolvedSearchParams.filter || "all";
  const searchTerm = resolvedSearchParams.searchFilter || undefined;
  const offsetValue = currentPage * 12 - 12;

  return {
    currentPage,
    filterValue,
    searchTerm,
    offsetValue,
  };
}

export function getPageNumbers(current, total) {
  const delta = 2;
  const range = [];

  for (
    let i = Math.max(1, current - delta);
    i <= Math.min(total, current + delta);
    i++
  ) {
    range.push(i);
  }

  return range;
}

export function formatTimeAgo(createdAt) {
  const now = new Date();
  const seconds = Math.floor((now - new Date(createdAt)) / 1000);

  if (seconds < 60) return `${seconds} sec${seconds !== 1 ? "s" : ""} ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes !== 1 ? "s" : ""} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`;

  const date = new Date(createdAt);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
});

export async function handleLogoutAction(setUser, setCart, setWishlist) {
  try {
    const res = await logout();
    if (res.success) {
      setUser({
        userId: "",
        firstName: "",
        lastName: "",
        displayName: "",
        email: "",
        phoneNumber: "",
        role: "",
      });
      setCart({
        cartItems: [],
        cartCount: 0,
      });
      setWishlist({
        wishlistItems: [],
        wishlistCount: 0,
      });
      toast.success("Logged out successfully");
    }
  } catch (error) {
    console.log(error.message);
    toast.error("Failed to logout, please try again");
  }
}

export function truncateText(text, max) {
  const words = text.split(" ");
  const maxWords = max || 8;

  let title = text;

  if (words.length > maxWords) {
    title = `${words.slice(0, maxWords).join(" ")}...`;
  }

  return title;
}
