import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ChoiceInfo } from 'src/app/poll-list/models/choice-info';
import { PollInfo } from 'src/app/poll-list/models/poll-info';

@Component({
  selector: 'app-poll-list-item',
  templateUrl: './poll-list-item.component.html',
  styleUrls: ['./poll-list-item.component.scss'],
})
export class PollListItemComponent implements OnInit {
  @Input() poll: PollInfo;
  currentVote: number;
  voteForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.voteForm = this.formBuilder.group({
      choiceGroup: new FormControl(),
    });
    this.currentVote = this.poll.selectedChoice;
  }

  calculatePercentage = (totalVotes, choice) => {
    if (totalVotes === 0) {
      return 0;
    }
    let percentVote = (choice.voteCount * 100) / totalVotes;
    return Math.round(percentVote * 100) / 100;
  };

  isWinner(poll: PollInfo, choice: ChoiceInfo) {
    let winningChoice: any = poll.expired
      ? this.getWinningChoice(poll.choices)
      : null;

    return winningChoice && choice.id === winningChoice.id;
  }

  getWinningChoice(choices: ChoiceInfo[]) {
    return choices.reduce(
      (prevChoice, currentChoice) =>
        currentChoice.voteCount > prevChoice.voteCount
          ? currentChoice
          : prevChoice,
      { voteCount: -Infinity }
    );
  }

  getTimeRemaining = (poll) => {
    const expirationTime = new Date(poll.expirationDateTime).getTime();
    const currentTime = new Date().getTime();

    var difference_ms = expirationTime - currentTime;
    var seconds = Math.floor((difference_ms / 1000) % 60);
    var minutes = Math.floor((difference_ms / 1000 / 60) % 60);
    var hours = Math.floor((difference_ms / (1000 * 60 * 60)) % 24);
    var days = Math.floor(difference_ms / (1000 * 60 * 60 * 24));

    let timeRemaining;

    if (days > 0) {
      timeRemaining = days + ' days left';
    } else if (hours > 0) {
      timeRemaining = hours + ' hours left';
    } else if (minutes > 0) {
      timeRemaining = minutes + ' minutes left';
    } else if (seconds > 0) {
      timeRemaining = seconds + ' seconds left';
    } else {
      timeRemaining = 'less than a second left';
    }

    return timeRemaining;
  };

  handleVoteChange(poll: PollInfo, choiceId: number) {
    this.currentVote = choiceId;
  }

  handleVoteSubmit() {
    // if (!this.isLoggedIn()) {
    //   this.toastr.info('Please login to vote.', 'Polling App');
    //   this.router.navigate(['/login']);
    // }
    // let voteData = {} as VoteInfo;
    // voteData.pollId = this.poll.id;
    // voteData.choiceId = this.voteForm.get('choiceGroup').value;
    // this.pollService
    //   .castPoll(voteData)
    //   .pipe(first())
    //   .subscribe(
    //     (data) => {
    //       this.poll = data;
    //     },
    //     (error) => {
    //       if (error.status === 401) {
    //         // this.authService.logout();
    //         this.toastr.error('You have been logged out. Please login to vote');
    //         this.router.navigate(['/login']);
    //       } else {
    //         this.toastr.error(
    //           error || 'Sorry! Something went wrong. Please try again!'
    //         );
    //       }
    //     }
    //   );
  }
}