import React   from 'react'

const MainLayout = ({children}) => {
  return (
    <div className='container mx-auto my-32'>
        {children}                     {/*here children means all the children routes */}
    </div>
  )
}

export default MainLayout