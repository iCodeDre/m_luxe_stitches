"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { use } from "react";

import classes from "./my-account-sidebar.module.css";

import { UserContext } from "@/store/user-context";

import profileImagePlaceHolder from "@/public/placeholder/profile-image-placeholder.jpg";
import LinkWithProgress from "../UI/link-with-progress";
import { handleLogoutAction } from "@/util/util";
import { CartContext } from "@/store/cart-context";

function MyAccountSidebar({ userRole }) {
  const { user, setUser } = use(UserContext);
  const { displayName } = user;
  const { setCart, setWishlist } = use(CartContext);

  const path = usePathname();
  return (
    <div className={classes.accountSidebar}>
      <header>
        <div className={classes.profileImageContainer}>
          <Image src={profileImagePlaceHolder} alt="profile-placeholder" />
        </div>

        <h1>{displayName}</h1>
      </header>

      <ul>
        <li>
          <LinkWithProgress
            href={userRole !== "admin" ? "/my-account" : "/admin-account"}
            className={
              path === "/my-account"
                ? classes.highlight
                : path === "/admin-account"
                ? classes.highlight
                : undefined
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#eb07a2"
            >
              <path d="M540-600v-200h260v200H540ZM160-480v-320h260v320H160Zm380 320v-320h260v320H540Zm-380 0v-200h260v200H160Zm40-360h180v-240H200v240Zm380 320h180v-240H580v240Zm0-440h180v-120H580v120ZM200-200h180v-120H200v120Zm180-320Zm200-120Zm0 200ZM380-320Z" />
            </svg>
            Dashboard
          </LinkWithProgress>
        </li>
        <li>
          <LinkWithProgress
            href={
              userRole !== "admin"
                ? "/my-account/my-orders"
                : "/admin-account/all-orders"
            }
            className={
              path.includes("/my-orders")
                ? classes.highlight
                : path.includes("/all-orders")
                ? classes.highlight
                : undefined
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#eb07a2"
            >
              <path d="M200-200v-436l-70.31-154.62 36.62-17.07L243.38-638h473.24l77.07-169.69 36.62 17.07L760-636v436H200Zm200-260h160q8.5 0 14.25-5.76t5.75-14.27q0-8.51-5.75-14.24T560-500H400q-8.5 0-14.25 5.76T380-479.97q0 8.51 5.75 14.24T400-460ZM240-240h480v-358H240v358Zm0 0v-358 358Z" />
            </svg>
            {userRole !== "admin" ? "My orders" : "All orders"}
          </LinkWithProgress>
        </li>
        <li>
          <LinkWithProgress
            href={
              userRole !== "admin"
                ? "/my-account/my-wishlist"
                : "/admin-account/my-wishlist"
            }
            className={
              path.includes("/my-wishlist") ? classes.highlight : undefined
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#eb07a2"
            >
              <path d="m480-173.85-30.31-27.38q-97.92-89.46-162-153.15-64.07-63.7-101.15-112.35-37.08-48.65-51.81-88.04Q120-594.15 120-634q0-76.31 51.85-128.15Q223.69-814 300-814q52.77 0 99 27t81 78.54Q514.77-760 561-787q46.23-27 99-27 76.31 0 128.15 51.85Q840-710.31 840-634q0 39.85-14.73 79.23-14.73 39.39-51.81 88.04-37.08 48.65-100.77 112.35Q609-290.69 510.31-201.23L480-173.85Zm0-54.15q96-86.77 158-148.65 62-61.89 98-107.39t50-80.61q14-35.12 14-69.35 0-60-40-100t-100-40q-47.77 0-88.15 27.27-40.39 27.27-72.31 82.11h-39.08q-32.69-55.61-72.69-82.5Q347.77-774 300-774q-59.23 0-99.62 40Q160-694 160-634q0 34.23 14 69.35 14 35.11 50 80.61t98 107q62 61.5 158 149.04Zm0-273Z" />
            </svg>
            My wishlist
          </LinkWithProgress>
        </li>
        <li>
          <LinkWithProgress
            href={
              userRole !== "admin"
                ? "/my-account/edit-account"
                : "/admin-account/edit-account"
            }
            className={
              path.includes("/edit-account") ? classes.highlight : undefined
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#eb07a2"
            >
              <path d="M200-200h43.92l427.93-427.92-43.93-43.93L200-243.92V-200Zm-40 40v-100.77l527.23-527.77q6.15-5.48 13.57-8.47 7.43-2.99 15.49-2.99t15.62 2.54q7.55 2.54 13.94 9.15l42.69 42.93q6.61 6.38 9.04 14 2.42 7.63 2.42 15.25 0 8.13-2.74 15.56-2.74 7.42-8.72 13.57L260.77-160H160Zm600.77-556.31-44.46-44.46 44.46 44.46ZM649.5-649.5l-21.58-22.35 43.93 43.93-22.35-21.58Z" />
            </svg>
            Edit account
          </LinkWithProgress>
        </li>

        <li>
          <button
            onClick={() => handleLogoutAction(setUser, setCart, setWishlist)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#eb07a2"
            >
              <path d="M224.62-160q-27.62 0-46.12-18.5Q160-197 160-224.62v-510.76q0-27.62 18.5-46.12Q197-800 224.62-800h256.15v40H224.62q-9.24 0-16.93 7.69-7.69 7.69-7.69 16.93v510.76q0 9.24 7.69 16.93 7.69 7.69 16.93 7.69h256.15v40H224.62Zm433.84-178.46-28.08-28.77L723.15-460H367.69v-40h355.46l-92.77-92.77 28.08-28.77L800-480 658.46-338.46Z" />
            </svg>
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}

export default MyAccountSidebar;
