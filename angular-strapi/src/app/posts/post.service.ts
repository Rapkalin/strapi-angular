import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.interface';
import {map, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = 'http://localhost:1337/api/articles';

  constructor(private http: HttpClient) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<{ data: Post[] }>('http://localhost:1337/api/articles')
      .pipe(
        map((response: { data: any; }) => response.data)
      );
  }

  updatePost(post: Post): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/${post.documentId}`, {
      data: {
        "title": post.title
      }
    });
  }

  createPost(post: Partial<Post>): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, {data: post});
  }

  deletePost(documentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${documentId}`);
  }
}
