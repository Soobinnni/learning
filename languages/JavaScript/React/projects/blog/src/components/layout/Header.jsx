const Header = ({title="My Blog"}) => {
    return <header id="header" className="[user-select:none] w-full p-10 text-center">
        <h1 className="m-auto w-fit text-4xl font-extrabold text-white/70 font-serif">{ title }</h1>
    </header>
}

export default Header;