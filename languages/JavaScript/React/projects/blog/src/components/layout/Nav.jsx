import { Link } from 'react-router-dom';
import logoImg from '../../assets/images/myblog-logo.png'
const Nav = () => {

    return <nav className="w-full bg-white/50 flex justify-between px-8 py-2">
        <Link to='/' className='left-side flex flex-row gap-2'>
            <img
                className='w-5 object-cover mx-auto'
                src={logoImg} alt="logo image"
            />
            <span

                className='[user-select:none] font-bold cursor-pointer'
            >my blog</span>
        </Link>
        <div className='right-side'>
            <p>로그아웃</p>
        </div>

    </nav>
}

export default Nav;