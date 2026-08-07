export default function LoginPage() {
    return (
        <div className="login-page">
            <h1 className="login-page__title">Login Page</h1>
            <form className="login-page__form" action="" method="post">
                <label className="login-page__label" htmlFor="username">Username:</label>
                <input className="login-page__input" type="text" id="username" name="username" />
                <label className="login-page__label" htmlFor="password">Password:</label>
                <input className="login-page__input" type="password" id="password" name="password" />
                <button className="login-page__button" type="submit">Login</button>
            </form>
        </div>
    );
}