import { Component } from '@angular/core';
import { PostService } from './post.service';
import { Post } from './post.interface';
import { NgForm, FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
  imports: [FormsModule],
})
export class PostsComponent {
  posts: Post[] = [];
  editingPostId: number | null = null;
  editedTitle: string = '';
  newPostTitle: string = '';

  constructor(private postService: PostService) {
    this.loadPosts();
  }

  loadPosts(): void {
    this.postService.getPosts().subscribe((data: Post[]) => {
      this.posts = data;
    });
  }

  editPost(post: Post): void {
    this.editingPostId = post.id;
    this.editedTitle = post.title;
  }

  deletePost(post: Post): void {
    if (confirm(`Voulez-vous vraiment supprimer le post "${post.title}" ?`)) {
      this.postService.deletePost(post.documentId).subscribe({
        next: () => {
          this.posts = this.posts.filter(p => p.id !== post.id); // Retirer le post supprimé de la liste locale
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du post :', err);
        }
      });
    }
  }

  savePost(post: Post): void {
    post.title = this.editedTitle;
    this.postService.updatePost(post).subscribe(
      () => {
        this.editingPostId = null;
        this.editedTitle = '';
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du post :', error);
      }
    );
  }

  addPost(): void {
    const newPost: Partial<Post> = {
      title: this.newPostTitle,
    };

    this.postService.createPost(newPost).subscribe({
      next: (createdPost) => {
        this.posts.push(createdPost);
        this.newPostTitle = ''; // Réinitialiser le champ après l'ajout
        this.loadPosts(); // Rafraîchit la liste des posts
      },
      error: (err) => {
        console.error('Erreur lors de la création du post :', err);
      }
    });
  }

  cancelEdit(): void {
    this.editingPostId = null;
    this.editedTitle = '';
  }
}
