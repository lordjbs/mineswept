import cc from 'classcat';
import styles from './Input.module.css';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = ({ className, ...props }: InputProps) => {
    return <input className={cc([styles.root, className])} {...props} />;
}

export default Input