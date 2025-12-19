
import { db } from '@/lib/db';
import { getAllProblems } from '@/modules/problems/actions';
import { currentUser } from '@clerk/nextjs/server'
import ProblemsTable from '@/modules/problems/components/problem-table';

const Problems = async () => {

  const user = await currentUser();
  let dbUser = null

  if(user){
     dbUser = await db.user.findUnique({
      where:{clerkId: user.id},
      select:{id: true, role:true}
    })
  }

  const {data: problems, error} = await getAllProblems();
  // console.log(problems);
  
  return (
    <div className="container mx-auto py-32">
      {/* Problems */}
      <ProblemsTable problems={problems} user={dbUser} />
      </div>
  )
}

export default Problems