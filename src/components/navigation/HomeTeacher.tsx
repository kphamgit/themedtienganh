import MainTeacher from './MainTeacher'
import { SideTeacher } from './SideTeacher';

export default function HomeTeacher(props: any ) {

    return (
        <div className='grid grid-cols-12 m-2 bg-bgColor1'>
            <div className='col-span-9'><MainTeacher/></div>
            <div className='col-span-3'>
            <div className='flex flex-col justify-between'>
              <div className=' bg-bgColor3 text-textColor1'><SideTeacher /></div>
              </div>
            </div>
        </div>
    )
}
