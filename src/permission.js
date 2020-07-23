import router from "./router";
import { resetRouter } from "./router";
import store from "./store";
import { Message } from "element-ui";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getToken } from "@/utils/auth"; // get token from cookie
import getPageTitle from "@/utils/get-page-title";

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ["/login", "/auth-redirect"]; // no redirect whitelist

router.beforeEach(async(to, from, next) => {
    // start progress bar
    NProgress.start();

    // set page title
    document.title = getPageTitle(to.meta.title);

    // determine whether the user has logged in
    const hasToken = store.state.user.token;

    if (hasToken) {
        if (to.path === "/login") {
            // if is logged in, redirect to the home page
            next({ path: "/" });
            NProgress.done();
        } else if (from.path === "/login") {
            NProgress.start();
            window.location.reload(true);
        } else {
            // determine whether the user has obtained his permission roles through getInfo
            const hasRoles = store.getters.roles && store.getters.roles.length > 0;
            if (hasRoles) {
                const accessRoutes = await store.dispatch(
                    "permission/generateRoutes",
                    store.getters.roles
                );
                var accessString = JSON.stringify(accessRoutes);
                console.log(accessString);
                if (to.path == "/" || to.path == "/dashboard") {
                    next();
                } else if (to.path.includes("/profile/index/")) {
                    next();
                } else {
                    // console.log(accessRoutes);
                    // console.log(accessString);
                    // console.log("allow:"+ accessString.includes('"path":"'+to.path+'",'));
                    if (accessString.includes(to.path)) {
                        next();
                    } else {
                        if (from.path !== "/404") {
                            next("/404");
                        }
                        NProgress.done();
                    }
                }

                // alert(store.state.user.userDetails.position);
                // router.addRoutes(accessRoutes)
            } else {
                try {
                    // get user info
                    // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
                    // const { roles } = await store.dispatch("user/getInfo");
                    // const roles = store.getters.roles;
                    // // generate accessible routes map based on roles
                    // const accessRoutes = await store.dispatch(
                    //     "permission/generateRoutes",
                    //     roles
                    // );
                    // // dynamically add accessible routes
                    // router.addRoutes(accessRoutes);
                    // // hack method to ensure that addRoutes is complete
                    // // set the replace: true, so the navigation will not leave a history record
                    // next({...to, replace: true });
                } catch (error) {
                    // remove token and go to login page to re-login
                    await store.dispatch("user/resetToken");
                    Message.error(error || "Has Error");

                    next(`/login?redirect=${to.path}`);
                    NProgress.done();
                }
            }
        }
    } else {
        /* has no token*/

        if (whiteList.indexOf(to.path) !== -1) {
            // in the free login whitelist, go directly
            next();
        } else {
            // other pages that do not have permission to access are redirected to the login page.
            next(`/login?redirect=${to.path}`);
            NProgress.done();
        }
    }
});

router.afterEach(() => {
    // finish progress bar
    NProgress.done();
});