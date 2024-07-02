// import { Link } from "react-router-dom";
const Header = (props) => {
    return (
        <header className="top-bar">
            {/* Menu Toggler */}
            <button
                className="menu-toggler la la-bars"
                type="button"
                onClick={e => {
                    e.preventDefault();
                    props.setShowMenu();
                }}
            />
            {/* Brand */}
            <span className="brand">WM System</span>
            {/* <div class="flex items-center ltr:ml-auto rtl:mr-auto">
                <button
                    className="menu-toggler la la-gear"
                    type="button"
                    onClick={e => {
                        e.preventDefault();
                        // props.setShowMenu();
                    }}
                />

            </div> */}
        </header>
    );
}

export default Header;
