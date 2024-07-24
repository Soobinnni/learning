import { NavLink } from "react-router-dom";


const ArticleNav = () => {
    const defaultStyle = 'block text-center border-b-2 py-2';
    const basicStyle = defaultStyle + ' border-black/20 '
    const activeStyle= defaultStyle + ' border-b-2 border-black  font-extrabold';
    return (
        <ul className="w-full mb-8">
            <li className="m-auto w-24">
                <NavLink to='/blog' className={({isActive}) => 
                    isActive? activeStyle : basicStyle
                }>글목록</NavLink>
            </li>
        </ul>
    )

}
export default ArticleNav;