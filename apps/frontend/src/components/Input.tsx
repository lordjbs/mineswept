import styles from './Input.module.css'
import cc from 'classcat'

type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = ({ className, ...props }: InputProps) => {
    return <input className={cc([styles.root, className])} {...props} />;
}

export default Input