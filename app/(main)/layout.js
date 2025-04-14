import React   from 'react'

const MainLayout = ({Children}) => {
  return (
    <div className='container mx-auto my-32'>
        {Children}                     {/*here children means all the children routes */}
    </div>
  )
}

export default MainLayout