
import useWorkShop from '@/hooks/useWorkShop/useWorkShop';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom'

const WorkShopDetail = () => {
    const {id}=useParams();
    const {}=useWorkShop();

    useEffect()

  return (
    <div>WorkShopDetail</div>
  )
}

export default WorkShopDetail