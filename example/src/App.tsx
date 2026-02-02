import { useState } from 'react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { SWRConfig } from 'swr';
import { SWRDevTools, swrDevToolsMiddleware } from 'swr-devtools';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// JSONPlaceholder Examples

// 1. List of Posts
function PostList() {
  const { data: posts, error, isLoading } = useSWR('https://jsonplaceholder.typicode.com/posts?_limit=5', fetcher);

  if (error) return <div>Failed to load posts</div>;
  if (isLoading) return <div>Loading posts...</div>;

  return (
    <div>
      <h3>Posts (Limited to 5)</h3>
      <ul style={{ paddingLeft: 20 }}>
        {posts?.map((post: any) => (
          <li key={post.id} style={{ marginBottom: 5 }}>
            <strong>{post.title.substring(0, 20)}...</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

// 2. Post Details (Dynamic Key)
function PostDetails() {
  const [postId, setPostId] = useState(1);
  const { data: post, isLoading } = useSWR(`https://jsonplaceholder.typicode.com/posts/${postId}`, fetcher);

  return (
    <div>
      <h3>Post Details</h3>
      <div style={{ marginBottom: 10 }}>
        <button disabled={postId <= 1} onClick={() => setPostId((p: number) => p - 1)}>Prev</button>
        <span style={{ margin: '0 10px' }}>Post ID: {postId}</span>
        <button onClick={() => setPostId((p: number) => p + 1)}>Next</button>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <pre style={{ background: '#f5f5f5', padding: 10, borderRadius: 4, overflow: 'auto', maxHeight: 200 }}>
          {JSON.stringify(post, null, 2)}
        </pre>
      )}
    </div>
  );
}

function ComplexKey() {
  // Object key
  const { data } = useSWR({ type: 'invoice', id: 123, status: 'pending' }, () => ({
    id: 123,
    amount: 500,
    currency: 'USD'
  }));

  return (
    <div>
       <h3>Invoice (Object Key)</h3>
       <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

function MutationExample() {
  const { trigger, isMutating, data } = useSWRMutation('https://jsonplaceholder.typicode.com/posts', async (_url, { arg }: { arg: string }) => {
     // Simulation of value creation
     await new Promise(r => setTimeout(r, 1000));
     return { id: 101, title: arg, body: 'bar', userId: 1 };
  });

  return (
    <div>
      <h3>Create Post Mutation</h3>
      <div style={{ display: 'flex', gap: 8 }}>
         <button onClick={() => trigger('New Post Title')} disabled={isMutating}>
          {isMutating ? 'Creating...' : 'Create Post'}
        </button>
      </div>
      {data && (
        <div style={{ marginTop: 10, padding: 10, background: '#e6fffa', borderRadius: 4 }}>
          Created: {data.title} (ID: {data.id})
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <SWRConfig value={{ use: [swrDevToolsMiddleware] }}>
      <div style={{ padding: 20, paddingBottom: 100, maxWidth: 800, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
        <h1 style={{ marginBottom: 20 }}>SWR DevTools Demo</h1>
        <p style={{ marginBottom: 30, color: '#666' }}>
          Explore the devtools panel below. It supports Query inspection, Data viewing, and Mutation tracking.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 30 }}>
          <div style={{ border: '1px solid #eee', padding: 20, borderRadius: 8 }}>
            <PostList />
          </div>
          <div style={{ border: '1px solid #eee', padding: 20, borderRadius: 8 }}>
            <PostDetails />
          </div>
          <div style={{ border: '1px solid #eee', padding: 20, borderRadius: 8 }}>
             <MutationExample />
          </div>
          <div style={{ border: '1px solid #eee', padding: 20, borderRadius: 8 }}>
            <h3>Legacy/Other</h3>
             {/* Keeping the complex key example to ensure we still test it */}
             <ComplexKey />
          </div>
        </div>
        <SWRDevTools />
      </div>
    </SWRConfig>
  );
}

export default App;
