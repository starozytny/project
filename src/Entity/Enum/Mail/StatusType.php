<?php

namespace App\Entity\Enum\Mail;

enum StatusType: int
{
    const Inbox = 0;
    const Draft = 1;
    const Sent = 2;
}
