import EditIcon from '../../../assets/svg/edit.svg'
import DeleteIcon from '../../../assets/svg/delete.svg'

const ArticleDetailIconMenu = ({ onDeleteClick }) => {
    const iconStyle = 'w-8 h-8 object-cover rounded-full bg-primary-500/80 m-auto shadow-md cursor-pointer hover:bg-primary-500/70';

    return (
        <menu className="w-fit m-auto flex flex-row gap-2">
            <img src={EditIcon} alt='edit icon' className={iconStyle + ' p-0.5'} />
            <img
                onClick={onDeleteClick}
                src={DeleteIcon} alt='delete icon'
                className={iconStyle + ' p-1'}
            />
        </menu>
    );
}
export default ArticleDetailIconMenu;