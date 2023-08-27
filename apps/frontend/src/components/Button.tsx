import cc from 'classcat';
import styles from './Button.module.css';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

const Button = ({ className, ...props }: ButtonProps) => {
    return <button className={cc([styles.root, className])} {...props} />;
}

export default Button