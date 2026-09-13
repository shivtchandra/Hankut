import Link from 'next/link';
import { Brand } from './Brand';
export function Topbar(){return <header className="topbar"><Brand/><nav className="nav"><Link href="/archive">지난 장면</Link><Link href="/profile">나의 기록</Link><Link href="/admin">관리자</Link></nav></header>}
