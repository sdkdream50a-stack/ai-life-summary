/**
 * Community Feed UI
 * Handles rendering, filters, and interactions for community feed
 */

class CommunityFeed {
  constructor() {
    this.currentPage = 1;
    this.currentFilter = 'all';
    this.isLoading = false;
    this.hasMore = true;
    this.lang = 'ko';
    this.observer = null;
    this.maxCharacters = 500;
  }

  /**
   * Initialize the feed
   */
  initialize(lang = 'ko') {
    this.lang = lang;

    // Initialize community data with language
    communityData.initialize(lang);

    // Render initial posts
    this.renderPosts(true);

    // Setup infinite scroll
    this.setupInfiniteScroll();

    // Setup event listeners
    this.setupEventListeners();
  }

  /**
   * Render posts
   */
  renderPosts(reset = false) {
    if (this.isLoading) return;

    if (reset) {
      this.currentPage = 1;
      this.hasMore = true;
    }

    this.isLoading = true;
    const feedContainer = document.getElementById('community-posts');

    if (reset) {
      feedContainer.innerHTML = this.renderLoadingSkeleton();
    }

    // Small delay for UX
    setTimeout(() => {
      const result = communityData.getPosts(this.currentPage, this.currentFilter);

      if (reset) {
        feedContainer.innerHTML = '';
      }

      if (result.posts.length === 0 && this.currentPage === 1) {
        feedContainer.innerHTML = this.renderEmptyState();
      } else {
        result.posts.forEach(post => {
          const postEl = this.createPostElement(post);
          feedContainer.appendChild(postEl);
        });
      }

      this.hasMore = result.hasMore;
      this.isLoading = false;

      // Update load more trigger visibility
      const loadMoreTrigger = document.getElementById('load-more-trigger');
      if (loadMoreTrigger) {
        loadMoreTrigger.style.display = this.hasMore ? 'flex' : 'none';
      }
    }, reset ? 300 : 100);
  }

  /**
   * Create post element
   */
  createPostElement(post) {
    const soulType = typeof getSoulTypeById !== 'undefined'
      ? getSoulTypeById(post.authorType)
      : null;

    const typeName = soulType
      ? (this.lang === 'ko' ? soulType.nameKo : soulType.nameEn)
      : post.authorType;

    const typeEmoji = soulType?.emoji || '';
    const gradient = soulType?.gradient || 'from-gray-400 to-gray-600';
    const isLiked = communityData.isLiked(post.id);
    const relativeTime = communityData.formatRelativeTime(post.timestamp, this.lang);

    const el = document.createElement('article');
    el.className = 'post-card';
    el.dataset.postId = post.id;

    el.innerHTML = `
      <div class="post-header">
        <div class="post-avatar bg-gradient-to-br ${gradient}">
          ${typeEmoji.split('').slice(0, 1).join('')}
        </div>
        <div class="post-meta">
          <div class="post-author">
            <span class="post-author-name">${this.escapeHtml(post.authorName)}</span>
            <span class="post-author-type">
              <span>${typeEmoji}</span>
              <span>${typeName}</span>
            </span>
            <span class="post-author-level">Lv.${post.authorLevel}</span>
          </div>
          <div class="post-time">${relativeTime}</div>
        </div>
      </div>

      <div class="post-content">${this.formatContent(post.content)}</div>

      ${post.attachment ? this.renderAttachment(post.attachment) : ''}

      <div class="post-actions">
        <button class="post-action-btn like-btn ${isLiked ? 'liked' : ''}" data-post-id="${post.id}">
          <svg viewBox="0 0 24 24" fill="${isLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <span class="action-count">${this.formatCount(post.likes)}</span>
        </button>

        <button class="post-action-btn comment-btn" data-post-id="${post.id}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
          <span class="action-count">${this.formatCount(post.commentCount)}</span>
        </button>

        <button class="post-action-btn share-btn" data-post-id="${post.id}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="18" cy="5" r="3"/>
            <circle cx="6" cy="12" r="3"/>
            <circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
        </button>
      </div>

      ${post.comments && post.comments.length > 0 ? this.renderCommentsSection(post) : ''}

      <div class="comment-input-container" style="display: none;">
        <input type="text" class="comment-input" placeholder="${this.t('addComment')}" maxlength="200">
        <button class="comment-submit-btn" disabled>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    `;

    // Setup post event listeners
    this.setupPostEventListeners(el, post);

    return el;
  }

  /**
   * Render attachment
   */
  renderAttachment(attachment) {
    if (!attachment) return '';

    if (attachment.type === 'life-summary') {
      const soulType = typeof getSoulTypeById !== 'undefined'
        ? getSoulTypeById(attachment.soulType)
        : null;
      const typeName = soulType
        ? (this.lang === 'ko' ? soulType.nameKo : soulType.nameEn)
        : attachment.soulType;
      const typeEmoji = soulType?.emoji || '';

      return `
        <div class="post-attachment">
          <div class="post-attachment-header">
            <span class="post-attachment-label">${this.t('testResult')}</span>
          </div>
          <div class="post-attachment-type">
            <span class="post-attachment-emoji">${typeEmoji}</span>
            <span class="post-attachment-name">${typeName}</span>
            ${attachment.score ? `<span class="post-attachment-score">${attachment.score}%</span>` : ''}
          </div>
        </div>
      `;
    }

    if (attachment.type === 'compatibility') {
      const myType = typeof getSoulTypeById !== 'undefined'
        ? getSoulTypeById(attachment.myType)
        : null;
      const partnerType = typeof getSoulTypeById !== 'undefined'
        ? getSoulTypeById(attachment.partnerType)
        : null;

      const myEmoji = myType?.emoji || '';
      const partnerEmoji = partnerType?.emoji || '';

      return `
        <div class="post-attachment">
          <div class="post-attachment-header">
            <span class="post-attachment-label">${this.t('compatibilityResult')}</span>
          </div>
          <div class="post-attachment-type">
            <span class="post-attachment-emoji">${myEmoji}</span>
            <span style="margin: 0 0.5rem; color: #f43f5e;">+</span>
            <span class="post-attachment-emoji">${partnerEmoji}</span>
            <span class="post-attachment-score" style="margin-left: auto;">${attachment.score}%</span>
          </div>
        </div>
      `;
    }

    return '';
  }

  /**
   * Render comments section
   */
  renderCommentsSection(post) {
    const displayComments = post.comments.slice(0, 3);
    const hasMoreComments = post.comments.length > 3;

    return `
      <div class="post-comments">
        <button class="comments-toggle" data-post-id="${post.id}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
          <span>${this.t('viewComments')} (${post.comments.length})</span>
        </button>
        <div class="comments-list" data-post-id="${post.id}">
          ${displayComments.map(comment => this.renderComment(comment)).join('')}
          ${hasMoreComments ? `<button class="load-more-comments" data-post-id="${post.id}">${this.t('loadMoreComments')}</button>` : ''}
        </div>
      </div>
    `;
  }

  /**
   * Render single comment
   */
  renderComment(comment) {
    const soulType = typeof getSoulTypeById !== 'undefined'
      ? getSoulTypeById(comment.authorType)
      : null;
    const gradient = soulType?.gradient || 'from-gray-400 to-gray-600';
    const emoji = soulType?.emoji?.split('')[0] || '';
    const relativeTime = communityData.formatRelativeTime(comment.timestamp, this.lang);

    return `
      <div class="comment-item">
        <div class="comment-avatar bg-gradient-to-br ${gradient}">${emoji}</div>
        <div class="comment-content">
          <span class="comment-author">${this.escapeHtml(comment.authorName)}</span>
          <p class="comment-text">${this.escapeHtml(comment.content)}</p>
          <span class="comment-time">${relativeTime}</span>
        </div>
      </div>
    `;
  }

  /**
   * Setup event listeners for a post
   */
  setupPostEventListeners(el, post) {
    // Like button
    const likeBtn = el.querySelector('.like-btn');
    likeBtn?.addEventListener('click', () => this.handleLike(post.id, likeBtn));

    // Comment button
    const commentBtn = el.querySelector('.comment-btn');
    commentBtn?.addEventListener('click', () => this.handleCommentToggle(el));

    // Share button
    const shareBtn = el.querySelector('.share-btn');
    shareBtn?.addEventListener('click', () => this.handleShare(post));

    // Comments toggle
    const commentsToggle = el.querySelector('.comments-toggle');
    const commentsList = el.querySelector('.comments-list');
    commentsToggle?.addEventListener('click', () => {
      commentsList?.classList.toggle('expanded');
    });

    // Comment input
    const commentInput = el.querySelector('.comment-input');
    const commentSubmit = el.querySelector('.comment-submit-btn');

    commentInput?.addEventListener('input', (e) => {
      commentSubmit.disabled = e.target.value.trim().length === 0;
    });

    commentInput?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && commentInput.value.trim()) {
        this.handleCommentSubmit(post.id, commentInput, el);
      }
    });

    commentSubmit?.addEventListener('click', () => {
      if (commentInput.value.trim()) {
        this.handleCommentSubmit(post.id, commentInput, el);
      }
    });
  }

  /**
   * Handle like action
   */
  handleLike(postId, button) {
    const result = communityData.toggleLike(postId);

    button.classList.toggle('liked', result.liked);
    const countEl = button.querySelector('.action-count');
    if (countEl) {
      countEl.textContent = this.formatCount(result.likes);
    }

    // Update heart icon fill
    const svg = button.querySelector('svg');
    if (svg) {
      svg.setAttribute('fill', result.liked ? 'currentColor' : 'none');
    }

    // XP reward for first like
    if (result.liked && typeof userDataManager !== 'undefined') {
      // Award small XP for engagement (optional)
    }
  }

  /**
   * Handle comment toggle
   */
  handleCommentToggle(postEl) {
    const inputContainer = postEl.querySelector('.comment-input-container');
    const commentsList = postEl.querySelector('.comments-list');

    if (inputContainer) {
      const isHidden = inputContainer.style.display === 'none';
      inputContainer.style.display = isHidden ? 'flex' : 'none';

      if (isHidden) {
        const input = inputContainer.querySelector('.comment-input');
        input?.focus();
      }
    }

    if (commentsList) {
      commentsList.classList.add('expanded');
    }
  }

  /**
   * Handle comment submit
   */
  handleCommentSubmit(postId, input, postEl) {
    const content = input.value.trim();
    if (!content) return;

    const comment = communityData.addComment(postId, content);
    if (!comment) return;

    // Clear input
    input.value = '';
    const submitBtn = postEl.querySelector('.comment-submit-btn');
    if (submitBtn) submitBtn.disabled = true;

    // Update UI
    let commentsList = postEl.querySelector('.comments-list');

    if (!commentsList) {
      // Create comments section
      const commentsSection = document.createElement('div');
      commentsSection.className = 'post-comments';
      commentsSection.innerHTML = `
        <button class="comments-toggle">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
          <span>${this.t('viewComments')} (1)</span>
        </button>
        <div class="comments-list expanded"></div>
      `;

      const inputContainer = postEl.querySelector('.comment-input-container');
      inputContainer.parentNode.insertBefore(commentsSection, inputContainer);
      commentsList = commentsSection.querySelector('.comments-list');
    }

    // Add new comment to list
    const commentEl = document.createElement('div');
    commentEl.innerHTML = this.renderComment(comment);
    commentsList.appendChild(commentEl.firstElementChild);
    commentsList.classList.add('expanded');

    // Update comment count in button
    const commentBtn = postEl.querySelector('.comment-btn .action-count');
    if (commentBtn) {
      const currentCount = parseInt(commentBtn.textContent) || 0;
      commentBtn.textContent = this.formatCount(currentCount + 1);
    }

    // Update toggle text
    const toggleText = postEl.querySelector('.comments-toggle span:last-child');
    if (toggleText) {
      const match = toggleText.textContent.match(/\((\d+)\)/);
      const count = match ? parseInt(match[1]) + 1 : 1;
      toggleText.textContent = `${this.t('viewComments')} (${count})`;
    }
  }

  /**
   * Handle share action
   */
  async handleShare(post) {
    const shareUrl = `https://smartaitest.com/community/`;
    const shareText = this.lang === 'ko'
      ? `AI 소울 타입 커뮤니티에서 이야기해요!`
      : `Join the AI Soul Type Community!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AI Soul Community',
          text: shareText,
          url: shareUrl
        });
      } catch (e) {
        // User cancelled or share failed
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        if (typeof gamificationUI !== 'undefined') {
          gamificationUI.showToast('', this.t('linkCopied'));
        }
      } catch (e) {
        console.error('Copy failed:', e);
      }
    }
  }

  /**
   * Set filter
   */
  setFilter(filter) {
    if (this.currentFilter === filter) return;

    this.currentFilter = filter;

    // Update tab UI
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.filter === filter);
    });

    // Re-render posts
    this.renderPosts(true);
  }

  /**
   * Setup infinite scroll
   */
  setupInfiniteScroll() {
    const trigger = document.getElementById('load-more-trigger');
    if (!trigger) return;

    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && this.hasMore && !this.isLoading) {
        this.currentPage++;
        this.renderPosts(false);
      }
    }, { threshold: 0.1 });

    this.observer.observe(trigger);
  }

  /**
   * Setup global event listeners
   */
  setupEventListeners() {
    // Filter tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.setFilter(tab.dataset.filter);
      });
    });

    // Write post FAB
    const writeFab = document.getElementById('write-post-fab');
    writeFab?.addEventListener('click', () => this.openWriteModal());

    // Write modal close
    const writeModalOverlay = document.getElementById('write-modal-overlay');
    const writeModalClose = document.getElementById('write-modal-close');

    writeModalClose?.addEventListener('click', () => this.closeWriteModal());
    writeModalOverlay?.addEventListener('click', (e) => {
      if (e.target === writeModalOverlay) {
        this.closeWriteModal();
      }
    });

    // Write textarea
    const writeTextarea = document.getElementById('write-textarea');
    const charCount = document.getElementById('write-char-count');
    const submitBtn = document.getElementById('write-submit-btn');

    writeTextarea?.addEventListener('input', (e) => {
      const length = e.target.value.length;
      charCount.textContent = `${length}/${this.maxCharacters}`;
      charCount.className = 'write-char-count';

      if (length > this.maxCharacters * 0.9) {
        charCount.classList.add('warning');
      }
      if (length > this.maxCharacters) {
        charCount.classList.add('error');
      }

      submitBtn.disabled = length === 0 || length > this.maxCharacters;
    });

    // Submit post
    submitBtn?.addEventListener('click', () => this.handlePostSubmit());

    // Attachment options
    document.querySelectorAll('.attachment-option').forEach(option => {
      option.addEventListener('click', () => this.selectAttachment(option.dataset.type));
    });

    // Remove attachment
    const removeAttachment = document.getElementById('remove-attachment');
    removeAttachment?.addEventListener('click', () => this.clearAttachment());
  }

  /**
   * Open write modal
   */
  openWriteModal() {
    const modal = document.getElementById('write-modal-overlay');
    modal?.classList.add('active');

    const textarea = document.getElementById('write-textarea');
    textarea?.focus();

    // Check for attachable results
    this.checkAttachableResults();
  }

  /**
   * Close write modal
   */
  closeWriteModal() {
    const modal = document.getElementById('write-modal-overlay');
    modal?.classList.remove('active');

    // Reset form
    const textarea = document.getElementById('write-textarea');
    const charCount = document.getElementById('write-char-count');
    const submitBtn = document.getElementById('write-submit-btn');

    if (textarea) textarea.value = '';
    if (charCount) charCount.textContent = `0/${this.maxCharacters}`;
    if (submitBtn) submitBtn.disabled = true;

    this.clearAttachment();
  }

  /**
   * Check for attachable results
   */
  checkAttachableResults() {
    if (typeof userDataManager === 'undefined') return;

    const userData = userDataManager.getUserData();
    const testHistory = userData.testHistory || [];

    // Find most recent test result
    const recentTest = testHistory[testHistory.length - 1];

    if (recentTest) {
      const attachSection = document.getElementById('attachment-section');
      if (attachSection) {
        attachSection.style.display = 'block';
      }
    }
  }

  /**
   * Select attachment
   */
  selectAttachment(type) {
    if (typeof userDataManager === 'undefined') return;

    const userData = userDataManager.getUserData();
    const testHistory = userData.testHistory || [];

    // Find recent test of this type
    const recentTest = [...testHistory]
      .reverse()
      .find(t => {
        if (type === 'life-summary') return t.testType === 'life-summary';
        if (type === 'compatibility') return t.testType === 'compatibility';
        return false;
      });

    if (!recentTest) return;

    // Store selected attachment
    this.selectedAttachment = {
      type: type,
      data: recentTest.result
    };

    // Update UI
    const selectedContainer = document.getElementById('selected-attachment');
    const optionsContainer = document.querySelector('.attachment-options');

    if (selectedContainer && optionsContainer) {
      optionsContainer.style.display = 'none';
      selectedContainer.style.display = 'flex';

      // Populate attachment preview
      if (type === 'life-summary' && recentTest.result?.soulType) {
        const soulType = typeof getSoulTypeById !== 'undefined'
          ? getSoulTypeById(recentTest.result.soulType)
          : null;

        const emoji = soulType?.emoji || '';
        const name = soulType
          ? (this.lang === 'ko' ? soulType.nameKo : soulType.nameEn)
          : recentTest.result.soulType;

        selectedContainer.querySelector('.selected-attachment-emoji').textContent = emoji;
        selectedContainer.querySelector('.selected-attachment-name').textContent = name;
      }
    }
  }

  /**
   * Clear attachment
   */
  clearAttachment() {
    this.selectedAttachment = null;

    const selectedContainer = document.getElementById('selected-attachment');
    const optionsContainer = document.querySelector('.attachment-options');

    if (selectedContainer) selectedContainer.style.display = 'none';
    if (optionsContainer) optionsContainer.style.display = 'flex';
  }

  /**
   * Handle post submit
   */
  handlePostSubmit() {
    const textarea = document.getElementById('write-textarea');
    const content = textarea?.value.trim();

    if (!content || content.length > this.maxCharacters) return;

    let attachment = null;
    if (this.selectedAttachment) {
      attachment = {
        type: this.selectedAttachment.type,
        ...this.selectedAttachment.data
      };
    }

    const post = communityData.createPost(content, attachment);

    if (post) {
      // Close modal
      this.closeWriteModal();

      // Add post to feed
      const feedContainer = document.getElementById('community-posts');
      const postEl = this.createPostElement(post);
      feedContainer.insertBefore(postEl, feedContainer.firstChild);

      // Show success toast
      if (typeof gamificationUI !== 'undefined') {
        gamificationUI.showToast('', this.t('postCreated'));
      }

      // Award XP
      if (typeof userDataManager !== 'undefined') {
        const result = userDataManager.addXp(20, 'community_post');
        if (result.leveledUp && typeof gamificationUI !== 'undefined') {
          const levelData = typeof levelXPSystem !== 'undefined'
            ? levelXPSystem.getLevelData(result.newLevel)
            : { name: { ko: `Level ${result.newLevel}` } };
          gamificationUI.showLevelUpPopup(result.newLevel, levelData, null, this.lang);
        }
      }
    }
  }

  /**
   * Render loading skeleton
   */
  renderLoadingSkeleton() {
    return `
      <div class="loading-posts">
        ${[1, 2, 3].map(() => `
          <div class="loading-post-skeleton">
            <div class="skeleton-header">
              <div class="skeleton-avatar"></div>
              <div class="skeleton-lines">
                <div class="skeleton-line"></div>
                <div class="skeleton-line"></div>
              </div>
            </div>
            <div class="skeleton-content"></div>
          </div>
        `).join('')}
      </div>
    `;
  }

  /**
   * Render empty state
   */
  renderEmptyState() {
    return `
      <div class="feed-empty">
        <div class="feed-empty-icon"></div>
        <p class="feed-empty-text">${this.t('noPosts')}</p>
      </div>
    `;
  }

  /**
   * Format content (escape HTML and highlight mentions)
   */
  formatContent(content) {
    let formatted = this.escapeHtml(content);

    // Highlight hashtags
    formatted = formatted.replace(
      /#([^\s#]+)/g,
      '<span class="highlight">#$1</span>'
    );

    return formatted;
  }

  /**
   * Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Format count (e.g., 1.2K)
   */
  formatCount(count) {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  }

  /**
   * Get translation
   */
  t(key) {
    const translations = {
      ko: {
        addComment: '댓글 작성...',
        viewComments: '댓글 보기',
        loadMoreComments: '더 보기',
        testResult: '테스트 결과',
        compatibilityResult: '궁합 결과',
        noPosts: '아직 게시물이 없어요',
        linkCopied: '링크가 복사되었습니다!',
        postCreated: '게시물이 작성되었습니다!'
      },
      en: {
        addComment: 'Add a comment...',
        viewComments: 'View comments',
        loadMoreComments: 'Load more',
        testResult: 'Test Result',
        compatibilityResult: 'Compatibility Result',
        noPosts: 'No posts yet',
        linkCopied: 'Link copied!',
        postCreated: 'Post created!'
      }
    };

    return translations[this.lang]?.[key] || translations.en[key] || key;
  }
}

// Global instance
const communityFeed = new CommunityFeed();

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CommunityFeed, communityFeed };
}
